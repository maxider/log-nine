#![allow(dead_code)]

use log::debug;
use sqlx::Row;
use crate::model::{Board, Team};
use super::*;
use crate::model::Task;

#[derive(Debug, Clone)]
pub struct BoardRepository {
    pool: Pool<Postgres>,
}

pub(super) const GET_BOARD_SQL: &'static str = "SELECT * FROM boards WHERE id = $1";

impl BoardRepository {
    pub fn new(pool: Pool<Postgres>) -> BoardRepository {
        BoardRepository {
            pool
        }
    }

    pub async fn create_board(&mut self, name: String) -> Result<Board, sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        let board = sqlx::query_as::<_, Board>("INSERT INTO boards (name) VALUES ($1) RETURNING *")
            .bind(name)
            .fetch_one(&mut *tx)
            .await?;
        tx.commit().await?;

        debug!("Created board with id: {}", board.id);
        Ok(board)
    }

    pub async fn get_board_by_id(&self, id: i32) -> Result<Board, sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        let board = sqlx::query_as::<_, Board>(GET_BOARD_SQL)
            .bind(id)
            .fetch_one(&mut *tx)
            .await?;
        tx.commit().await?;
        Ok(board)
    }

    pub async fn get_all_tasks(&self, board_id: i32) -> Result<Vec<Task>, sqlx::Error> {
        let mut tx = self.pool.begin().await?;

        let tasks = sqlx::query_as::<_, Task>("SELECT * FROM tasks WHERE board_id = $1")
            .bind(board_id)
            .fetch_all(&mut *tx)
            .await?;

        tx.commit().await?;
        Ok(tasks)
    }

    pub async fn get_all_teams(&self, board_id: i32) -> Result<Vec<Team>, sqlx::Error> {
        let mut tx = self.pool.begin().await?;

        let teams = sqlx::query_as::<_, Team>("SELECT * FROM teams WHERE board_id = $1")
            .bind(board_id)
            .fetch_all(&mut *tx)
            .await?;

        tx.commit().await?;
        Ok(teams)
    }

    pub async fn exists_board(&self, board_id: i32) -> Result<bool, sqlx::Error> {
        let mut tx = self.pool.begin().await?;
        let exists = sqlx::query("SELECT EXISTS(SELECT 1 FROM boards WHERE id = $1)")
            .bind(board_id)
            .fetch_one(&mut *tx)
            .await
            .unwrap()
            .get::<bool, _>(0);
        tx.commit().await?;
        Ok(exists)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[sqlx::test]
    async fn test_create_board(pool: Pool<Postgres>) -> sqlx::Result<()> {
        let mut board_repository = BoardRepository::new(pool);
        let board = board_repository.create_board("test".to_string()).await?;
        assert_eq!(board.name, "test");
        assert_eq!(board.visual_id_counter, 1);
        dbg!(board);
        Ok(())
    }

    #[sqlx::test]
    async fn test_get_board_by_id(pool: Pool<Postgres>) -> sqlx::Result<()> {
        let mut board_repository = BoardRepository::new(pool);
        let board = board_repository.create_board("test".to_string()).await?;
        let board = board_repository.get_board_by_id(board.id).await?;
        assert_eq!(board.name, "test");
        Ok(())
    }
    
    #[sqlx::test]
    async fn test_exists_board(pool: Pool<Postgres>) -> sqlx::Result<()> {
        let mut board_repository = BoardRepository::new(pool);
        let board = board_repository.create_board("test".to_string()).await?;
        assert!(board_repository.exists_board(board.id).await?);
        Ok(())
    }
}