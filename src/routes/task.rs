use crate::error;
use crate::token::SignedToken;
use axum::routing::post;
use axum::{Json, Router};
use serde::Deserialize;

pub fn router() -> Router {
    Router::new()
        .route("/create_task", post(create_task))
}

#[derive(Debug, Deserialize)]
struct CreateTaskBody {
    board_id: i32,
    title: String,
    target_id: Option<i32>,
    description: Option<String>,
    status: i32,
}

// #[debug_handler]
async fn create_task(signed_token: SignedToken, body: Json<CreateTaskBody>) -> error::Result<String> {
    let token = signed_token.verify()?;
    
    Ok(format!("Task created by user {}", token.sub))
}