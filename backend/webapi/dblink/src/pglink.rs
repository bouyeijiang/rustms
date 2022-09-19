use crate::dbcfg::Dbcfg;
use tokio_postgres::{Client, Error, NoTls, Row};

pub struct PgLink{}

impl PgLink{
async fn db_client(conf: &mut Dbcfg) -> Result<Client, Error> {
    let conn_str = &conf.to_pg_connstr();
    let (client, connection) = tokio_postgres::connect(conn_str, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });

    Ok(client)
}

pub async fn db_execute(conf: &mut Dbcfg, command_text: &str) -> Result<u64, Error> {
    let client =PgLink::db_client(conf).await?;

    let rt = client.execute(command_text, &[]).await?;

    Ok(rt)
}

pub async fn db_batch_execute(conf:&mut Dbcfg,command_texts:&str)->Result<(),Error>{
    let client =PgLink::db_client(conf).await?;

    let rt = client.batch_execute(command_texts).await?;

    Ok(rt)
}

pub async fn db_query(conf: &mut Dbcfg, command_text: &str) -> Result<Vec<Row>, Error> {
    let client = PgLink::db_client(conf).await?;

    let rt = client.query(command_text, &[]).await?;

    Ok(rt)
}

pub async fn db_query_one(conf: &mut Dbcfg, command_text: &str) -> Result<Row, Error> {
    let client = PgLink::db_client(conf).await?;

    let rt = client.query_one(command_text, &[]).await?;
    Ok(rt)
}
}