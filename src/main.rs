mod token_manager;
mod token;
mod model;
mod context;
mod repositories;
mod routes;

use crate::context::AppContext;
use axum::routing::get;
use axum::{Extension, Json, Router};
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};
use std::env;
use log::info;
use token::Token;
use tokio::net::TcpListener;

type Result<T> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync>>;

const ADDR: &'static str = "localhost:8000";

#[tokio::main]
async fn main() -> Result<()>{
    dotenv().ok();
    env_logger::init();
    
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = Pool::<Postgres>::connect(&db_url).await?;
    
    let context = AppContext {
        pool
    };

    let app = Router::new()
        .route("/ping", get(pong))
        .nest("/api", routes::auth::route())
        .layer(Extension(context));

    let listener = TcpListener::bind(ADDR).await.unwrap();
    info!("Server running on {}", ADDR);
    axum::serve(listener, app).await.unwrap();
    
    Ok(())
}

async fn pong(context: Extension<AppContext>) -> String {
    context.pool.is_closed().to_string()
}

#[derive(Serialize,Deserialize, Debug)]
struct LoginBody{
    password: String
}