use crate::context::Context;
use crate::error;
use crate::model::{Task, Team};
use axum::extract::Path;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::Router;
use serde::Serialize;

pub fn router() -> Router {
    Router::new().route("/:board_id/content", get(get_board))
}


#[derive(Debug, Serialize)]
struct BoardContentResponse {
    board_id: u32,
    tasks: Vec<Task>,
    teams: Vec<Team>,
}

impl IntoResponse for BoardContentResponse {
    fn into_response(self) -> axum::http::Response<axum::body::Body> {
        let body = serde_json::to_string(&self).unwrap();
        axum::http::Response::builder()
            .header("Content-Type", "application/json")
            .body(axum::body::Body::from(body))
            .unwrap()
    }
}

async fn get_board(context: Context, Path(board_id): Path<i32>) -> error::Result<BoardContentResponse> {
    let board_exists = context.board_repository.exists_board(board_id).await?;
    if !board_exists {
        return Err(error::Error::NotFound);
    }
    let tasks = context.board_repository.get_all_tasks(board_id).await?;
    let teams = context.board_repository.get_all_teams(board_id).await?;
    Ok(BoardContentResponse {
        board_id: board_id as u32,
        tasks,
        teams,
    })
}