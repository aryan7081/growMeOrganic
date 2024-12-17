import React, { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from 'primereact/paginator';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';



const Table: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState(0)
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [numRowsToSelect, setNumRowsToSelect] = useState(0);

    const op = useRef<OverlayPanel>(null);

    const fetchData = async (page: number) => {
        const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
        const result = await response.json();
        return result
      };

      useEffect(() => {
        fetchData(page).then((result) => {
            setData(result.data);
            setTotalRecords(result.pagination.total);
        });
    }, [page]);

      const onPageChange = (event: any) => {
        setPage(event.page);
      };

      const onSelectionChange = (e: any) => {
        setSelectedRows(e.value); 
    };

    const handleSelectRows = () => {
        const newSelection = data.slice(0, numRowsToSelect);
        setSelectedRows(newSelection);
        op.current?.hide();
      };



  return (
    <div style={{ position: 'relative', padding: '20px' }}>
        <div className="p-d-flex p-ai-center p-jc-between p-mb-3" style={{ position: 'relative' }}>
            <div className="p-d-flex p-ai-center" style={{ position: 'relative' }}>
                <Button style={{ position: 'absolute', top: '35px', left: '115px', transform: 'translateY(-50%)', zIndex: 9999, padding: '3px', maxWidth: '15px', maxHeight: '15px'}} icon="pi pi-chevron-down" className="p-button-text p-mr-2" onClick={(e) => op.current?.toggle(e)}/>
            </div>
      </div>
      <OverlayPanel ref={op}>
        <div className="p-field">
          <label htmlFor="numRows">Number of Rows to Select:</label>
          <InputText id="numRows" value={numRowsToSelect.toString()} onChange={(e) => setNumRowsToSelect(Number(e.target.value))} type="number" placeholder="Enter number of rows"/>
        </div>

        <div className="p-d-flex p-jc-between">
          <Button label="Cancel" icon="pi pi-times" onClick={() => op.current?.hide()} className="p-button-text" />
          <Button label="Submit" icon="pi pi-check" onClick={handleSelectRows} />
        </div>
      </OverlayPanel>
      <DataTable value={data} selection={selectedRows} onSelectionChange={onSelectionChange} tableStyle={{ minWidth: '50rem' }}>
            <Column selectionMode="multiple"  headerStyle={{ width: '3rem' }}></Column>
            <Column field="title" header = "Title"></Column>
            <Column field="place_of_origin" header = "Place of Origin"></Column>
            <Column field="artist_display" header = "Artist Display"></Column>
            <Column field="inscriptions" header = "Inscriptions"></Column>
            <Column field="date_start" header = "Date Start"></Column>
            <Column field="date_end" header = "Date End"></Column>
      </DataTable>
      <Paginator first={page*12} rows={12} totalRecords={totalRecords} onPageChange={onPageChange} />
    </div>
  )
}

export default Table;