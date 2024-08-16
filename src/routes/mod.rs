use axum::Router;

pub mod auth;
pub mod board;
mod task;

pub(crate) fn router() -> Router {
    Router::new()
        .nest("/auth", auth::router())
        .nest("/board", board::router())
        .nest("/task", task::router())
}