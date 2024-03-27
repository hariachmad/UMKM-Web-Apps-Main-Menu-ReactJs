import React, { useEffect, useState, ComponentLifecycle } from 'react'
import './App.css'
import 'bootstrap'
import axiosinstance from '../src/lib/axios';
import { formToJSON } from 'axios';



function App() {
  const [count, setCount] = useState(0);
  const [showNewComponent, setShowNewComponent] = useState(Array(6).fill(false));
  const [Qty,setInputQty]=useState(Array(6).fill(null));
  const [namaItem,setNamaItem]=useState(Array(6).fill(null));
  const [totalQty,setTotalQty]=useState(0);
  const [hitung, setHitung]=useState(0);
  const [hitungKlik,setHitungKlik]=useState(1);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [selectedLokasi, setLokasi] = useState(null);
  const [dataPLU,setDataPLU]=useState(null);
  const [dataHarga,setDataHarga]=useState(Array(6).fill(0));

    useEffect(()=>{console.log(dataPLU)},[dataPLU]);  
    useEffect(() => {
        fetchData();
    },[]);

    const fetchData = async () => {
      try {
        const response= await axiosinstance.get("/posts/ambilData")
        const jsonData = response.data;   

        // console.log(dataObject.data);
        const jsonDataNew=jsonData.data
        const jsonDataMap=jsonDataNew.map(function(data){return data.plu_barang_jadi})
        setDataPLU(jsonDataMap);

      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors (e.g., display an error message)
      }
    };


    async function fetchDataHarga(plu){
      try {
        const response= await axiosinstance.get("/posts/ambilHarga/"+plu)
        const jsonData = response.data;   

        // console.log(dataObject.data);
        const jsonDataNew=jsonData.data
        const jsonDataMap=jsonDataNew.map(function(data){return data.harga})

  //       const newValues = Qty;
  // newValues[index] = event.target.value;
  // setInputQty(newValues);
       
        const newValues=dataHarga;
        newValues[hitung]=jsonDataMap[0];
        setDataHarga(newValues);

        console.log(dataHarga);



      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors (e.g., display an error message)
      }
    };

    
  




  function handleDateTimeChange(event){
    setSelectedDateTime(event.target.value);
    console.log(selectedDateTime);
  };

  function handleLokasiChange(event){
    setLokasi(event.target.value);
    console.log(selectedLokasi);
  };


  useEffect(
    ()=>{
      setTotalQty(jumlahkan());
    },[Qty[0],Qty[1],Qty[2],Qty[3],Qty[4],Qty[5]]
  )
  
function LogHitung()
{
  console.log(hitungKlik);
}

  function ButtonTambahItem({onClick})
{
  return <button type="button" className="btn btn-primary" onClick={onClick}>Tambah Item</button>
}

function ButtonSimpan({onClick})
{
  return <button type="button" className="btn btn-primary" onClick={onClick}>Simpan</button>
}

function jumlahkan()  
{ 
  let total = 0;
  Qty.forEach(element => {
    if (element)
    {total += parseInt(element);}
  });
  return total;
}

  function handleChange(event,index)
  {
  const newValues = namaItem;
  newValues[index] = event.target.value;
  setNamaItem(newValues);
  console.log(newValues);
}

function handleEnter(event,index)
  {

    if (event.keyCode === 13){
  const newValues = Qty;
  newValues[index] = event.target.value;
  setInputQty(newValues);
  fetchDataHarga(namaItem[hitung]);
  console.log(Qty);
  setHitung(hitung+1);
  
  
  }
}

function NewComponent({id}) {

  return  <div className='input'>
  <label className='label' for="combo-box-nama-item">Nama Item :</label>
  <select name={id} value={namaItem[id]} onChange={(event)=>handleChange(event,event.target.name)}>
    <option value="-">-</option>
    <option value="1">Sushi</option>
    <option value="2">Nigiri</option>
    <option value="3">Gunkan</option>
    <option value="4">Chicken Rice Menthai</option>
    <option value="5">Samyhang Roll</option>
  </select>
  <label className='qty'>Qty :</label>
  <input className='qty' type="text" id={id} name="name" value={Qty[id]} onKeyUp={(event) => handleEnter(event,event.target.id)}/>
</div>
}

function TotalQty(){
return  <div className='input'>
  <label className='label' for="combo-box-nama-item">Total :</label>
  <input type="text" id="qty-total" name="name" value={totalQty} disabled/> 
  </div>
  }



  const handleClick = (arg) => {
    const nextComponent=showNewComponent.slice();
    nextComponent[arg]=(true);
    setShowNewComponent(nextComponent);
    setCount(count+1);
    setHitungKlik(hitungKlik+1);

    console.log(hitungKlik);

  };

  const handleSimpan= async ()=>{

    // try {
    //   const productsResponse = await axiosinstance.get("/posts")

    //   console.log(productsResponse.data);
    // } catch (error) {
    //   console.log("Data Gagal Di dapatkan")
    // }

    // const data={
    //   nomor_transaksi_penjualan :'4',
    //   tanggal_transaksi_penjualan : '25/03/2024',
    //   plu_barang_jadi : '1',
    //   qty : '2',
    //   total_harga : 4000,
    //   lokasi : 'arcamanik'
    // }

    for (let i=0; i<hitungKlik; i++) {
      const data={
        tanggal_transaksi_penjualan : selectedDateTime,
        plu_barang_jadi : namaItem[i],
        qty : Qty[i],
        total_harga : dataHarga[i]*Qty[i],
        lokasi : selectedLokasi
      }
  await axiosinstance.post('/posts/simpan', data)
  .then(response => {
    console.log(response.data); // Handle successful response data
  })
  .catch(error => {
    console.error(error); // Handle errors
  });
    }

   
      
  };

  return (
    <div id="form-input" className="bg-warning-subtle">
      <LogHitung/>
      <h2>INPUT HASIL PENJUALAN</h2>
      <form>
        <div className='input'>
         <label className='label' for="date-picker" >Tanggal Penjualan :</label>
         <input type='date' id="date-picker" name="date-picker" onChange={(event)=>handleDateTimeChange(event)}></input>
        </div>

        <div className='input'>
          <label className='label' for="combo-box-lokasi">Pilih Lokasi :</label>
          <select id="combo-box-lokasi" name="combo-box-lokasi" onChange={(event)=>{handleLokasiChange(event)}}>
            <option value="-">-</option>
            <option value="Arcamanik">Arcamanik</option>
            <option value="Gasibu">Gasibu</option>
          </select>
        </div>

        <NewComponent id='0'/>

        {showNewComponent[0] && <NewComponent id='1'/>}
        {showNewComponent[1] && <NewComponent id='2'/>}
        {showNewComponent[2] && <NewComponent id='3'/>}
        {showNewComponent[3] && <NewComponent id='4'/>}
        {showNewComponent[4] && <NewComponent id='5'/>}

        <div>
          <TotalQty/>
        </div>
        
        

        <span>
          <ButtonTambahItem onClick={()=>handleClick(count)}/>
          
        </span>
        <span className='btn'>
          <ButtonSimpan onClick={()=>handleSimpan()}/>
        </span>
        

      </form>
        

    </div>
  )
}

export default App


