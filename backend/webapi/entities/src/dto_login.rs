use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DtoLogin {
    pub uname: String,
    pub upwd: String,
}
