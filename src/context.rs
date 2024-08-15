use sqlx::{Pool, Postgres};

#[derive(Clone)]
pub struct AppContext {
    pub pool: Pool<Postgres>,
}