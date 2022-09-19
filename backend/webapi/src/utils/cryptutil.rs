extern crate crypto;
extern crate rustc_hex;

use std::str;
use crypto::digest::Digest;
use crypto::md5::Md5;
use crypto::sha1::Sha1;
use crypto::sha3::Sha3;
use crypto::{ symmetriccipher, buffer, aes, blockmodes };
use crypto::buffer::{ ReadBuffer, WriteBuffer, BufferResult };
use rustc_hex::{ToHex, FromHex};
//use rustc_hex::{ToHex,FromHex};

pub struct CryptoUtil{}

impl CryptoUtil{

    #[allow(dead_code)]
    pub fn to_sha3(input:&str)->String{
        let mut hasher = Sha3::sha3_256();
        hasher.input_str(input);
        hasher.result_str()
    }

    #[allow(dead_code)]
    pub fn to_sha1(input:&str)->String{
        let mut sha1=Sha1::new();
        sha1.input_str(input);
        sha1.result_str()
    }

    #[allow(dead_code)]
    pub fn to_md5(input:&str)->String{
        let mut md5=Md5::new();
        md5.input_str(input);
        md5.result_str()
    }

    #[allow(dead_code)]
    pub fn aes_encrypt(message:&str,key_str:&str)->String{
        let key=key_str.as_bytes();
        let msg=message.as_bytes();

        let encrypted_data=CryptoUtil::aes_ecb_encrypt(msg,&key).ok().unwrap();
        let val=encrypted_data.as_slice();
        let encrypted_message:String=val.to_hex();

        encrypted_message
    }

    #[allow(dead_code)]
    pub fn aes_decrypt(encrypted_hex:&str,key_str:&str)->String{

        let hex_str=encrypted_hex.to_string();
        let en_data:Vec<u8>=hex_str.from_hex().unwrap();
        let en_bytes=en_data.as_slice();

        let key=key_str.as_bytes();
 
        let decrypted_data=CryptoUtil::aes_ecb_decrypt(en_bytes,&key).ok().unwrap();
        let decrypted_message=str::from_utf8(decrypted_data.as_slice()).unwrap();
        
        decrypted_message.to_string()
    }

    fn aes_ecb_encrypt(data: &[u8],key: &[u8])->Result<Vec<u8>,symmetriccipher::SymmetricCipherError>{
        let mut encryptor=aes::ecb_encryptor(
            aes::KeySize::KeySize256,
            key,
            blockmodes::PkcsPadding);
    
        let mut final_result=Vec::<u8>::new();
        let mut read_buffer=buffer::RefReadBuffer::new(data);
        let mut buffer=[0;4096];
        let mut write_buffer=buffer::RefWriteBuffer::new(&mut buffer);

        loop{
        
            let result= encryptor.encrypt(&mut read_buffer,&mut write_buffer,true)?;
            final_result.extend(write_buffer.take_read_buffer().take_remaining().iter().map(|&i| i));
    
            match result {
                BufferResult::BufferUnderflow=>break,
                BufferResult::BufferOverflow=>{},
            }
        }
    
        Ok(final_result)
    }

    fn aes_ecb_decrypt(encrypted_data: &[u8], key: &[u8])->Result<Vec<u8>,symmetriccipher::SymmetricCipherError>{
        let mut decryptor = aes::ecb_decryptor(
            aes::KeySize::KeySize256,
            key,
            blockmodes::PkcsPadding);
    
        let mut final_result = Vec::<u8>::new();
        let mut read_buffer = buffer::RefReadBuffer::new(encrypted_data);
        let mut buffer = [0; 4096];
        let mut write_buffer = buffer::RefWriteBuffer::new(&mut buffer);
    
        loop {
            let result = decryptor.decrypt(&mut read_buffer, &mut write_buffer, true)?;
            final_result.extend(write_buffer.take_read_buffer().take_remaining().iter().map(|&i| i));
            match result {
                BufferResult::BufferUnderflow => break,
                BufferResult::BufferOverflow => { }
            }
        }
    
        Ok(final_result)
    }

} 