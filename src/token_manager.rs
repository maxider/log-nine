// use std::error::Error;
// use chrono::{DateTime, Utc};
// use hmac::{Hmac, Mac};
// use jwt::SignWithKey;
// use serde::{Deserialize, Serialize};
// use sha2::Sha256;
// use sqlx::{Connection, FromRow, Pool, Postgres};
// 
// #[derive(Debug, Serialize, Deserialize)]
// struct PublicToken {
//     id: i32,
// }
// 
// impl From<Token> for PublicToken {
//     fn from(token: Token) -> Self {
//         PublicToken {
//             id: token.id,
//         }
//     }
// }
// 
// #[derive(Debug, Serialize, Deserialize, FromRow)]
// struct Token {
//     id: i32,
//     owner: String,
//     description: String,
//     expires_at: DateTime<Utc>,
//     revoked: bool,
//     is_admin: bool,
// }
// 
// pub async fn create_token(key: &Hmac<Sha256>, db_connection: &Pool<Postgres>, owner: String, description: String, expires_at: DateTime<Utc>) -> Result<(), Box<dyn Error>> {
//     let mut tx = db_connection.begin().await?;
// 
//     let query = r#"
//         INSERT INTO tokens (owner, description, expires_at)
//         VALUES ($1, $2, $3)
//         RETURNING *"#;
// 
//     let token = sqlx::query_as::<_, Token>(query)
//         .bind(owner)
//         .bind(description)
//         .bind(expires_at)
//         .fetch_one(&mut *tx)
//         .await?;
// 
//     tx.commit().await?;
// 
//     let public_token = PublicToken::from(token);
//     let signed_str = public_token.sign_with_key(key).unwrap();
// 
//     dbg!(signed_str);
// 
//     Ok(())
// }
// 
// pub async fn revoke_token(db_connection: &Pool<Postgres>, token_id: i32) -> Result<(), Box<dyn Error>> {
//     let mut tx = db_connection.begin().await?;
// 
//     let query = r#"
//         UPDATE tokens
//         SET revoked = true
//         WHERE id = $1"#;
// 
//     sqlx::query(query)
//         .bind(token_id)
//         .execute(&mut *tx)
//         .await?;
// 
//     tx.commit().await?;
// 
//     Ok(())
// }
// 
