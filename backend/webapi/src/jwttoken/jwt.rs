use chrono::prelude::*;
use chrono::Duration as Durationx;

use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub aud: String,
    pub exp: i64,
    pub issued: i64,
    pub issuer: String,
    pub sub: String,
}

static mut PRIVATEKEY: Option<&EncodingKey> = None;
static mut PUBLICKEY: Option<&DecodingKey> = None;

impl Claims {
    pub fn get_private_key(&self) -> EncodingKey {
        unsafe {
            match PRIVATEKEY {
                Some(pri) => pri.clone(),
                None => {
                    let pem =
                        EncodingKey::from_rsa_pem(include_bytes!("../../conf/privatekey.pem"))
                            .unwrap();
                    let r_pem = pem.clone();
                    PRIVATEKEY = Some(Box::leak(Box::new(r_pem)));
                    pem
                }
            }
        }
    }

    pub fn get_public_key(&self) -> DecodingKey {
        unsafe {
            match PUBLICKEY {
                Some(publ) => publ.clone(),
                None => {
                    let pem = DecodingKey::from_rsa_pem(include_bytes!("../../conf/publickey.pem"))
                        .unwrap();

                    let r_pem = pem.clone();
                    PUBLICKEY = Some(Box::leak(Box::new(r_pem)));
                    pem
                }
            }
        }
    }

    pub fn new(_issuer: &str, _sub: &str) -> Claims {
        Claims {
            aud: "bouyei".to_owned(),
            exp: 60,
            issued: 60,
            issuer: _issuer.to_owned(),
            sub: _sub.to_owned(),
        }
    }

    pub fn create_token(&mut self, exp_seconds: i64) -> String {
        let _issued = Local::now().timestamp();
        let _exp = Local::now() + Durationx::seconds(exp_seconds);

        self.exp = _exp.timestamp();
        self.issued = _issued;

        let pem = self.get_private_key();

        let token =
            encode::<Claims>(&Header::new(Algorithm::RS256), &self, &pem).unwrap_or_default();
        format!("Bearer {}",token)
    }

    pub fn valiate_token(&self, jwt_str: &str) -> (Claims, bool) {
        let pem = self.get_public_key();

        let token = decode::<Claims>(jwt_str, &pem, &Validation::new(Algorithm::RS256));

        let mt = match token {
            Ok(t) => {
                (t.claims, true)
            }
            _error => {
                println!("{:?}", _error);
                let def = Claims::new("", "");
                (def, false)
            }
        };

        mt
    }
}
