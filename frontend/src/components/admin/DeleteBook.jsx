import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const data = [
  "S.NO",
  "Book id ",
  "Book Name",
  "Author Name",
  "Genre",
  "Delete Book",
  " "
];

const DeleteBook = () => {

  const adminInfos = useSelector((state) => state.admin);
  const [reqData, setReqData] = useState([]);
  const [selected, setSelected]= useState("all");

  const getRequestsData = async () => {
    try {
      if (selected==="all"){
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/books`
        );
        setReqData(response?.data);
      }
      else{
        const response= await axios.get(`${process.env.REACT_APP_API_URL}/books/all/${selected}`);
        setReqData(response?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRequestsData();
  }, [selected]);

  const handleDelete = async (bookId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/books/delete`,
        {
          bookId: bookId,
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  const handleCategoryChange=(event)=>{
    setSelected(event.target.value);
  }
  return (
    <div className="w-[95%] min-h-max max-h-[98%] overflow-x-scroll overflow-y-scroll scrollbar">
      <table className="w-[100%] border-collapse  relative">
        <thead>
          <tr className="sticky bg-slate-800  top-0 left-0 right-0 border-[1px] border-slate-200 text-white">
            {data?.map((data, idx) => {
              return (
                <th
                  key={idx}
                  className="p-2 border-[0.5px] border-r-slate-400 min-w-fit whitespace-nowrap"
                >
                  {data}
                </th>
              );
            })}
            <th>
              <tr>
                <select  id="bookCat" className="text-black" value={selected} onChange={handleCategoryChange} >
                  <option value="all">All</option>
                  <option value="Personal Growth">Personal Growth</option>
                  <option value="History">History</option>
                  <option value="Technology">Technology</option>
                  <option value="Leadership & Entrepreneurs">Leadership & Entrepreneurs</option>
                  <option value="Health and Fitness">Health and Fitness</option>
                </select>
              </tr>
            </th>
          </tr>
        </thead>

        <tbody>
          {reqData?.map((data, idx) => {
            return (
              <tr
                style={{
                  opacity: "1",
                }}
                key={idx}
                className="bg-slate-500 text-white border-[1px] border-slate-200"
              >
                <td className="bg-fixed top-0  left-0 bottom- 0 bg-slate-900 p-3 text-center border-[0.5px] border-r-slate-400 w-[100%] whitespace-nowrap ">
                  {idx + 1}
                </td>
                <td className="p-3 text-center border-[0.5px] border-r-slate-400 w-[100%] whitespace-nowrap ">
                  {data?._id}
                </td>
                <td className="p-3 text-center border-[0.5px] border-r-slate-400 w-[100%] whitespace-nowrap ">
                  {data?.bookname}
                </td>
                <td className="p-3 text-center border-[0.5px] border-r-slate-400 w-[100%] whitespace-nowrap ">
                  {data?.authorname}
                </td>
                <td className="p-3 text-center border-[0.5px] border-r-slate-400 w-[100%] whitespace-nowrap ">
                  {data?.type}
                </td>
                <td className="p-3 text-center font-semibold border-[0.5px] border-r-slate-400 w-[100%] whitespace-nowrap ">
                  <button
                  onClick={()=>handleDelete(data._id)}
                   className="w-[100px] bg-red-500 p-1 rounded-md shadow-md">
                    DELETE
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DeleteBook;
