
export default async function withTokenRefresh(call, refresh) {
    let res = await call();
    if (res.status !== 401) return res; 
  
    const r = await refresh();
    if (!r.ok) return res;             
  
    return await call();            
  }
  