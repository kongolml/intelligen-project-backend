import React, { useEffect, useState } from 'react'
import { ApiClient } from 'adminjs'
import { Box, Loader, Pagination, Table, TableRow, TableCell } from '@adminjs/design-system'

// components
import MediaLibrary from './MediaLibrary.js'

const api = new ApiClient()

const MediaFileCustomPage = () => {
  const [records, setRecords] = useState([])
  const [meta, setMeta] = useState({ page: 1, perPage: 10, total: 0 })
  const [loading, setLoading] = useState(true)

  // fetches data for the current page
  const fetchData = (page = 1) => {
    setLoading(true)
    api.resourceAction({
      resourceId: 'MediaFile',
      actionName: 'list',
      params: { page },
    }).then(res => {
      setRecords(res.data.records)
      setMeta({ 
        page: res.data.meta.page,
        perPage: res.data.meta.perPage,
        total: res.data.meta.total
      })
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <Loader />

  return (
    <>
      <MediaLibrary records={records} />

      <Pagination
        page={meta.page}
        perPage={meta.perPage}
        total={meta.total}
        onChange={page => fetchData(page)}
      />
    </>
    
    // <Box>
    //   <Table>
    //     <thead>
    //       <tr>
    //         <th>File Name</th>
    //         <th>MIME</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       <MediaLibrary records={records} />
    //       {/* {records.map(r => (
    //         <TableRow key={r.id}>
    //           <TableCell>{r.params.s3Key}</TableCell>
    //           <TableCell>{r.params.mime}</TableCell>
    //         </TableRow>
    //       ))} */}
    //     </tbody>
    //   </Table>
    //   <Pagination
    //     page={meta.page}
    //     perPage={meta.perPage}
    //     total={meta.total}
    //     onChange={page => fetchData(page)}
    //   />
    // </Box>
  )
}

export default MediaFileCustomPage
