use crate::error;
use crate::token::{SignedToken, Token};
use axum::routing::post;
use axum::{async_trait, Json, Router};
use axum::extract::{FromRequest, FromRequestParts, Request};
use axum::http::request::Parts;
use hmac::digest::Update;
use log::debug;
use serde::Deserialize;
use crate::context::Context;
use crate::model::Task;

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

async fn create_task(mut cx: Context, token: Token, body: Json<CreateTaskBody>) -> error::Result<Json<Task>> {
    let Json(body) = body;

    if !token.is_admin {
        debug!("User with id '{}' attempted to create a task without being an admin", token.sub);
        return Err(error::Error::Unauthorized { message: "Only admins can create tasks" });
    }

    let created_task = cx.task_repository.create_task(body.title, body.board_id).await?;

    Ok(Json(created_task))
}

#[derive(Debug, Deserialize)]
struct UpdateTaskBody {
    task_id: i32,
    title: Option<String>,
    description: Option<String>,
    status: Option<i32>,
    target_id: Option<i32>,
    board_id: Option<i32>,
}

async fn update_task(mut cx: Context, token: Token, body: Json<UpdateTaskBody>) -> error::Result<Json<Task>> {
    let Json(body) = body;

    if !token.is_admin {
        debug!("User with id '{}' attempted to update a task without being an admin", token.sub);
        return Err(error::Error::Unauthorized { message: "Only admins can update tasks" });
    }

    let updated_task = cx.task_repository.update_task(body.task_id, None, None, None, None).await?;

    Ok(Json(updated_task))
}