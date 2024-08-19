use axum::async_trait;
use axum::extract::FromRequestParts;
use axum::http::header::ToStrError;
use axum::http::HeaderValue;
use axum::http::request::Parts;
use axum::response::{IntoResponse, Response};
use hmac::{Hmac, Mac};
use jwt::{SignWithKey, VerifyWithKey};
use log::debug;
use serde::{Deserialize, Serialize};
use sha2::Sha256;
use crate::error::{Error, Result};
use crate::error::Error::BadRequest;

const KEY: &'static [u8; 6] = b"secret";

#[derive(Debug, Serialize, Deserialize)]
pub struct Token {
    pub sub: i32,
    pub exp: i64,
    pub is_admin: bool,
}

pub fn get_key() -> Hmac<Sha256> {
    Hmac::new_from_slice(KEY).unwrap()
}

impl Token {
    pub fn sign(&self) -> Result<SignedToken> {
        let key = get_key();
        let signed = self.sign_with_key(&key).map_err(|e| Error::new_internal(e.into()))?;
        Ok(SignedToken(signed))
    }
}

impl PartialEq for Token {
    fn eq(&self, other: &Self) -> bool {
        self.sub == other.sub && self.exp == other.exp && self.is_admin == other.is_admin
    }
}

#[async_trait]
impl<S> FromRequestParts<S> for Token {
    type Rejection = Error;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> std::result::Result<Self, Self::Rejection> {
        let header = parts.headers.get("Authorization").ok_or(SignedTokenError::EmptyToken)?;
        let signed = SignedToken::try_from(header)?;

        signed.verify()
    }
}

#[derive(Debug)]
pub struct SignedToken(pub String);

#[derive(Debug)]
pub enum SignedTokenError {
    FormatError(ToStrError),
    NotBearer,
    EmptyToken,
}

impl From<SignedTokenError> for Error {
    fn from(value: SignedTokenError) -> Self {
        match value {
            SignedTokenError::FormatError(e) => {
                BadRequest { message: format!("Error parsing token: {:?}", e) }
            }
            SignedTokenError::NotBearer => { BadRequest { message: "Token must be of type Bearer".into() } }
            SignedTokenError::EmptyToken => { BadRequest { message: "Token is empty".into() } }
        }
    }
}

impl SignedToken {
    pub fn verify(&self) -> Result<Token> {
        let key = get_key();
        let SignedToken(token) = self;
        debug!("Verifying token: {}", token);
        let verified: Token = token.verify_with_key(&key).map_err(|e| {
            debug!("Error verifying token: {:?}", e);
            BadRequest { message: "The token could not be verified".to_string() }
        })?;

        debug!("Token verified: {:?}", verified);

        if verified.exp < chrono::Utc::now().timestamp() {
            debug!("Token expired");
            return Err(Error::Unauthorized { message: "Token expired".into() });
        }
        Ok(verified)
    }
}

impl TryFrom<&HeaderValue> for SignedToken {
    type Error = SignedTokenError;

    fn try_from(header: &HeaderValue) -> Result<Self, Self::Error> {
        let token = header.to_str().map_err(|e| SignedTokenError::FormatError(e))?;
        let mut token_split = token.split_whitespace();
        if token_split.next() != Some("Bearer") {
            return Err(SignedTokenError::NotBearer);
        }
        if let Some(token) = token_split.next() {
            Ok(SignedToken(token.to_string()))
        } else {
            Err(SignedTokenError::EmptyToken)
        }
    }
}

impl TryFrom<Token> for SignedToken {
    type Error = ();

    fn try_from(value: Token) -> std::result::Result<Self, Self::Error> {
        value.sign().map_err(|_| ())
    }
}

impl IntoResponse for SignedToken {
    fn into_response(self) -> Response {
        Response::new(self.0.into())
    }
}
#[cfg(test)]
mod tests {
    use super::*;

    fn get_token() -> Token {
        Token {
            sub: 0,
            exp: chrono::Utc::now().timestamp() + 1000,
            is_admin: false,
        }
    }

    #[test]
    fn test_sign_and_verify() {
        let token = get_token();
        let signed = token.sign();
        assert!(matches!(signed, Ok(SignedToken(_))));
    }

    #[test]
    fn test_verify_invalid() {
        let token = get_token();
        let signed = token.sign().ok().unwrap();
        let SignedToken(mut token) = signed;
        token.push_str("a");
        let signed = SignedToken(token);
        //replace with assert_matches! when it's stable
        assert!(matches!(signed.verify(), Err(BadRequest { message }) if message == "The token could not be verified"));
    }

    //tests for try from
    #[test]
    fn test_try_from() {
        let header_value = HeaderValue::from_static("Bearer token.some.value");
        let signed_res = SignedToken::try_from(&header_value);
        assert!(matches!(signed_res, Ok(SignedToken(_))));
        if let Ok(SignedToken(token)) = signed_res {
            assert_eq!(token, "token.some.value");
        }
    }

    #[test]
    fn test_try_from_not_bearer() {
        let header_value = HeaderValue::from_static("token.some.value");
        let signed_res = SignedToken::try_from(&header_value);
        assert!(matches!(signed_res, Err(SignedTokenError::NotBearer)));
    }

    #[test]
    fn test_try_from_invalid_token() {
        let header_value = HeaderValue::from_static("Bearer");
        let signed_res = SignedToken::try_from(&header_value);
        assert!(matches!(signed_res, Err(SignedTokenError::EmptyToken)));
    }
}