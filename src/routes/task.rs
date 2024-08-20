use crate::error;
use crate::model::token::Token;
use axum::routing::{delete, patch, post};
use axum::{async_trait, Json, RequestExt, Router};
use axum::extract::{FromRequest, Path, Request};
use axum::extract::rejection::JsonRejection;
use axum::http::StatusCode;
use log::{debug, info};
use serde::Deserialize;
use crate::context::Context;
use crate::error::Error;
use crate::error::Error::BadRequest;
use crate::model::{Task, TaskPriority};

pub fn router() -> Router {
    Router::new()
        .route("/create_task", post(create_task))
        .route("/update_task", patch(update_task))
        .route("/delete_task/:task_id", delete(delete_task))
}

#[derive(Debug, Deserialize)]
struct CreateTaskBody {
    board_id: i32,
    title: String,
    target_id: Option<i32>,
    description: Option<String>,
}

async fn create_task(mut cx: Context, token: Token, body: Json<CreateTaskBody>) -> error::Result<Json<Task>> {
    let Json(body) = body;

    if !token.is_admin {
        debug!("User with id '{}' attempted to create a task without being an admin", token.sub);
        return Err(error::Error::Unauthorized { message: "Only admins can create tasks" });
    }

    let created_task = cx.task_repository.create_task(body.title, body.board_id, body.target_id, body.description).await?;

    info!("User with id '{}' created task with id '{}'", token.sub, created_task.id);

    Ok(Json(created_task))
}

#[derive(Debug, Deserialize)]
struct UpdateTaskBody {
    task_id: i32,
    title: Option<String>,
    description: Option<String>,
    status: Option<i32>,
    target_id: Option<i32>,
    task_priority: Option<TaskPriority>,
}

#[async_trait]
impl<S> FromRequest<S> for UpdateTaskBody
where
    S: Send + Sync + 'static,
{
    type Rejection = Error;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let body = Json::<UpdateTaskBody>::from_request(req, state)
            .await
            .map(|Json(body)| body)
            .map_err(|e|
                match e {
                    JsonRejection::JsonDataError(e) => { BadRequest { message: format!("Failed to deserialize the JSON body into the target type: {:?}", e) } }
                    _ => Error::new_internal(e.into())
                }
            )?;

        if let Some(status) = body.status {
            if status < 0 || status > 5 {
                return Err(BadRequest { message: format!("Invalid status: {}. Status must be between 0 and 5 (inclusive)", body.status.unwrap()) });
            }
        }

        Ok(body)
    }
}

async fn update_task(mut cx: Context, token: Token, body: UpdateTaskBody) -> error::Result<Json<Task>> {
    if !token.is_admin {
        debug!("User with id '{}' attempted to update a task without being an admin", token.sub);
        return Err(error::Error::Unauthorized { message: "Only admins can update tasks" });
    }

    let updated_task = cx.task_repository.update_task(body.task_id, body.title, body.description, body.target_id, body.status, body.task_priority).await?;

    info!("User with id '{}' updated task with id '{}'", token.sub, body.task_id);

    Ok(Json(updated_task))
}

async fn delete_task(mut cx: Context, token: Token, task_id: Path<i32>) -> error::Result<StatusCode> {
    let Path(task_id) = task_id;

    if !token.is_admin {
        debug!("User with id '{}' attempted to remove a task without being an admin", token.sub);
        return Err(error::Error::Unauthorized { message: "Only admins can remove tasks" });
    }

    cx.task_repository.delete_task(task_id).await?;

    info!("User with id '{}' removed task with id '{}'", token.sub, task_id);

    Ok(StatusCode::NO_CONTENT)
}