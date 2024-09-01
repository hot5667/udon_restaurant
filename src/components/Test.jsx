import React, { useState } from 'react'
import supabase from '../supaBasecClient'

const Test = () => {
  const [imgs, setImgs] = useState([]);
  const [data, setData] = useState(null);

  const STORAGE_NAME = 'images';

  const uploadFile = async (PostID, file) => {
    const { data, error } = await supabase
      .storage
      .from(STORAGE_NAME)
      .upload(`${PostID}/${file.name}`, file)
    if (error) {
      throw error;
    }
  }

  const getFiles = async (PostID) => {
    const { data, error } = await supabase
      .storage
      .from(STORAGE_NAME)
      .list(`3`)
    if (error) {
      throw error;
    } else {
      console.log(data, data.map(ele => ele.name))
      setData(data);
    }
  }

  const deleteFile = async (PostID, fileNames) => {
    const { data, error } = await supabase
      .storage
      .from(STORAGE_NAME)
      .remove(fileNames.map(fileName => `${PostID}/${fileName}`))
    if (error) {
      throw error;
    } else {
      console.log('40 :',data)
      // setData(data);
    }
  }

  return (
    <div>
      <p>test</p>
      <div>
      <input type='file' onChange={(e) => {
        console.log(e.target.files[0].name);
        e.preventDefault();
        setImgs([e.target.files[0]])
      }} />
      <button onClick={() => {
        uploadFile(3, imgs[0]);
      }}>사진 저장</button>

      <button onClick={(e) => {
        e.preventDefault();
        getFiles(3);
        console.log(data);
      }}>사진 불러오기</button>

      <button onClick={(e) => {
        e.preventDefault();
        deleteFile(3, ['main.png', 'notAdded.png']);
        console.log(data);
      }}>사진 삭제</button>
      </div>
    </div>
  )
}

export default Test
