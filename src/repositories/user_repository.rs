use crate::model::user::User;
use super::*;

pub struct UserRepository {
    pool: Pool<Postgres>
}

impl UserRepository {
    pub fn new(pool: Pool<Postgres>) -> UserRepository {
        UserRepository {
            pool
        }
    }

    pub async fn create_user(&mut self, name: String) -> Result<User, sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        let user = sqlx::query_as::<_, User>("INSERT INTO users (name) VALUES ($1) RETURNING *")
            .bind(name)
            .fetch_one(&mut *tx)
            .await?;
        tx.commit().await?;
        Ok(user)
    }

    pub async fn create_admin(&mut self, name: String) -> Result<User, sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        let user = sqlx::query_as::<_, User>("INSERT INTO users (name, is_admin) VALUES ($1, true) RETURNING *")
            .bind(name)
            .fetch_one(&mut *tx)
            .await?;
        tx.commit().await?;
        Ok(user)
    }

    pub async fn get_user_by_id(&mut self, id: i32) -> Result<User, sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_one(&mut *tx)
            .await?;
        tx.commit().await?;
        Ok(user)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[sqlx::test]
    async fn test_create_user(pool: Pool<Postgres>) -> sqlx::Result<()>{
        let mut user_repository = UserRepository::new(pool);
        let user = user_repository.create_user("test".to_string()).await?;
        assert_eq!(user.name, "test");
        Ok(())
    }
    
    #[sqlx::test]
    async fn test_create_admin(pool: Pool<Postgres>) -> sqlx::Result<()>{
        let mut user_repository = UserRepository::new(pool);
        let user = user_repository.create_admin("test".to_string()).await?;
        assert_eq!(user.name, "test");
        assert_eq!(user.is_admin, true);
        Ok(())
    }
    
    #[sqlx::test]
    async fn test_get_user_by_id(pool: Pool<Postgres>) -> sqlx::Result<()>{
        let mut user_repository = UserRepository::new(pool);
        let user = user_repository.create_user("test".to_string()).await?;
        let user = user_repository.get_user_by_id(user.id).await?;
        assert_eq!(user.name, "test");
        Ok(())
    }
}