use axum::http::HeaderValue;
use hmac::{Hmac, Mac};
use jwt::{SignWithKey, VerifyWithKey};
use log::debug;
use serde::{Deserialize, Serialize};
use sha2::Sha256;

const KEY: &'static [u8; 6] = b"secret";

#[derive(Debug)]
pub enum TokenError {
    InvalidToken(jwt::Error),
    ExpiredToken,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Token {
    pub sub: i32,
    pub exp: i64,
    pub is_admin: bool,
}

pub fn get_key() -> Hmac<Sha256> {
    Hmac::new_from_slice(b"secret").unwrap()
}

impl Token {
    pub fn sign(&self) -> Result<SignedToken, TokenError> {
        let key = get_key();
        let signed = self.sign_with_key(&key).map_err(|e| TokenError::InvalidToken(e))?;
        Ok(SignedToken(signed))
    }
}

impl PartialEq for Token {
    fn eq(&self, other: &Self) -> bool {
        self.sub == other.sub && self.exp == other.exp && self.is_admin == other.is_admin
    }
}

pub struct SignedToken(pub String);

impl SignedToken {
    pub fn value(&self) -> String {
        self.0.clone()
    }
    pub fn verify(&self) -> Result<Token, TokenError> {
        let key = get_key();
        let SignedToken(token) = self;
        debug!("Verifying token: {}", token);
        let verified: Token = token.verify_with_key(&key).map_err(|e| {
            debug!("Error verifying token: {:?}", e);
            TokenError::InvalidToken(e)
        })?;

        debug!("Token verified: {:?}", verified);

        if verified.exp < chrono::Utc::now().timestamp() {
            debug!("Token expired");
            return Err(TokenError::ExpiredToken);
        }
        Ok(verified)
    }
}

impl From<&HeaderValue> for SignedToken {
    fn from(header: &HeaderValue) -> Self {
        let token = header.to_str().unwrap().split_whitespace().last().unwrap();
        SignedToken(token.to_string())
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
        let signed = token.sign().unwrap();
        assert_eq!(token, signed.verify().unwrap());
    }

    #[test]
    fn test_verify_invalid() {
        let token = get_token();
        let signed = token.sign().unwrap();
        let SignedToken(mut token) = signed;
        token.push_str("a");
        let signed = SignedToken(token);
        //replace with assert_matches! when it's stable
        assert!(matches!(signed.verify(), Err(TokenError::InvalidToken(_))));
    }
}