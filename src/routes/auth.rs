use std::env;
use crate::token::{SignedToken, Token, TokenError};
use axum::http::HeaderMap;
use axum::routing::get;
use axum::{Extension, Json, Router};
use crate::context::AppContext;
use crate::LoginBody;

pub fn route() -> Router {
    Router::new()
        .route("/auth/verify", get(verify_token))
        .route("/auth/login", get(login))
}

async fn verify_token(headers: HeaderMap) -> String {
    let token_maybe = headers.get("Authorization");
    let token = if let Some(token) = token_maybe {
        SignedToken::from(token)
    } else {
        return "No token provided".to_string();
    };
    match token.verify() {
        Ok(_) => "Token is valid".to_string(),
        Err(TokenError::InvalidToken(_)) => "Token is invalid".to_string(),
        Err(TokenError::ExpiredToken) => "Token is expired".to_string()
    }
}

async fn login(_context: Extension<AppContext>, body: Json<LoginBody>) -> String {
    if body.password != env::var("OWNER_PW").unwrap() {
        return "Invalid password".to_string();
    }
    let token = Token {
        sub: 0,
        exp: chrono::Utc::now().timestamp() + 10,
        is_admin: true,
    };

    token.sign().unwrap().value()
}