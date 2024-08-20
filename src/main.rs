mod model;
mod context;
mod repositories;
mod routes;
mod error;
pub use error::Result;

use crate::context::AppContext;
use axum::routing::get;
use axum::{Extension, Router};
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};
use std::env;
use log::info;
use tokio::net::TcpListener;

const ADDR: &'static str = "localhost:8000";

#[tokio::main]
async fn main() -> core::result::Result<(), anyhow::Error > {
    dotenv().ok();
    env_logger::init();

    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = Pool::<Postgres>::connect(&db_url).await?;

    let context = AppContext {
        pool: pool.clone(),
        user_repository: repositories::user_repository::UserRepository::new(pool.clone()),
        board_repository: repositories::board_repository::BoardRepository::new(pool.clone()),
        task_repository: repositories::task_repository::TaskRepository::new(pool.clone()),
    };

    let app = Router::new()
        .route("/ping", get(pong))
        .nest("/api", routes::router())
        .layer(Extension(context));


    let listener = TcpListener::bind(ADDR).await?;
    info!("Server running on {}", ADDR);
    axum::serve(listener, app).await?;

    Ok(())
}

async fn pong() -> String {
    "Pong".to_string()
}

#[derive(Serialize, Deserialize, Debug)]
struct LoginBody {
    name: String,
    password: String,
}