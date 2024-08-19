use std::fmt;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use log::error;

pub type Result<T, E = Error> = std::result::Result<T, E>;

pub enum Error {
    InternalServerError,
    NotFound,
    BadRequest { message: String },
    UnprocessableEntity { error: String },
    Unauthorized { message: &'static str },
    Forbidden,
}

impl Error {
    pub fn new_internal(e: anyhow::Error) -> Self {
        error!("Internal server error: {:?}", e);
        Self::InternalServerError
    }
}

impl From<sqlx::Error> for Error {
    fn from(e: sqlx::Error) -> Self {
        error!("SQLx error: {:?}", e);
        match e {
            sqlx::Error::RowNotFound => Self::NotFound,
            _ => Self::InternalServerError,
        }
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::http::Response<axum::body::Body> {
        match self {
            Error::InternalServerError => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
            Error::NotFound => StatusCode::NOT_FOUND.into_response(),
            Error::BadRequest { message } => (StatusCode::BAD_REQUEST, message).into_response(),
            Error::UnprocessableEntity { error } => (StatusCode::UNPROCESSABLE_ENTITY, error).into_response(),
            Error::Unauthorized { message } => (StatusCode::UNAUTHORIZED, message).into_response(),
            Error::Forbidden => (StatusCode::FORBIDDEN).into_response(),
        }
    }
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(match self {
            Self::BadRequest { message: _ } => "Malformed request",
            Self::InternalServerError => "An unexpected error occurred",
            Self::UnprocessableEntity { error: _ } => "Invalid request body",
            Self::NotFound => "The requested resource does note exist",
            Self::Unauthorized { message: _ } => "User not authenticated",
            Self::Forbidden => "User not authorized",
        })
    }
}