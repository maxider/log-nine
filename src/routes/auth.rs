use crate::context::AppContext;
use crate::token::{SignedToken, Token};
use crate::{LoginBody};
use crate::error::{Result, Error};
use axum::routing::get;
use axum::{Extension, Json, Router};
use log::debug;

pub fn router() -> Router {
    Router::new()
        .route("/verify", get(verify_token))
        .route("/login", get(login))
}

async fn verify_token(signed_token: SignedToken) -> Result<String> {
    let token = signed_token.verify()?;
    debug!("Token verification result: {:?}", token);
    Ok(true.to_string())
}

async fn login(context: Extension<AppContext>, body: Json<LoginBody>) -> Result<SignedToken> {
    let user_maybe = context.user_repository.get_user_by_name(body.name.clone()).await?;

    let user = user_maybe.ok_or(Error::NotFound)?;

    debug!("User '{}' is attempting to login", user.name);

    if user.password != body.password {
        debug!("User '{}' failed to login. Wrong Password", user.name);
        return Err(Error::Unauthorized { message: "Wrong password" });
    }

    let token = Token {
        sub: user.id,
        exp: chrono::Utc::now().timestamp() + 60 * 60,
        is_admin: user.is_admin,
    };
    let signed_token = SignedToken::try_from(token).map_err(|_| Error::new_internal(anyhow::anyhow!("Error signing token")))?;
    debug!("User '{}' logged in successfully", user.name);
    Ok(signed_token)
}