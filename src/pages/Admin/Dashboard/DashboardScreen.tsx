import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowRight, Boxes, CircleDollarSign, ClipboardList,
  ImagePlus, Layers3, PackagePlus, RefreshCw, ShoppingBag, Tags, Users
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { useGetAdminDashboardQuery } from '../../../service/adminDashboardApi';

const COLORS = ['#7C3AED','#A78BFA','#C4B5FD','#DDD6FE','#4C1D95','#8B5CF6'];
const money = (value:number) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);

const quickActions = [
  { label:'Add product', copy:'Create a catalog listing', path:'/admin/products/add', icon:PackagePlus },
  { label:'All products', copy:'Review and edit the catalog', path:'/admin/products/list', icon:ShoppingBag },
  { label:'Categories', copy:'Organise catalog navigation', path:'/admin/products/categories', icon:Tags },
  { label:'Inventory', copy:'Monitor and adjust stock', path:'/admin/products/inventory', icon:Boxes },
  { label:'Orders', copy:'Process customer orders', path:'/admin/orders/list', icon:ClipboardList },
  { label:'Product images', copy:'Manage catalog media', path:'/admin/products/images', icon:ImagePlus },
];

export default function DashboardScreen() {
  const { data, isLoading, isFetching, error, refetch } = useGetAdminDashboardQuery();
  const dashboard = data?.data;
  const summary = dashboard?.summary || {
    totalRevenue:0,totalOrders:0,totalCustomers:0,totalProducts:0,
    pendingOrders:0,totalStock:0,reservedStock:0,lowStock:0,
  };
  const stats = [
    { label:'Total revenue', value:money(summary.totalRevenue), note:'Successful payments', icon:CircleDollarSign },
    { label:'Total orders', value:String(summary.totalOrders), note:`${summary.pendingOrders} need attention`, icon:ClipboardList },
    { label:'Customers', value:String(summary.totalCustomers), note:'Active customer accounts', icon:Users },
    { label:'Products', value:String(summary.totalProducts), note:`${summary.totalStock} units in inventory`, icon:Layers3 },
  ];

  if (isLoading) return <div className="grid min-h-[60vh] place-items-center"><div className="text-center"><RefreshCw className="mx-auto animate-spin text-violet-600"/><p className="mt-3 text-sm font-semibold text-gray-500">Loading store overview…</p></div></div>;

  return <div className="mx-auto max-w-[1500px] text-gray-950">
    <section className="relative overflow-hidden rounded-xl bg-[#17171A] px-6 py-7 text-white sm:px-8">
      <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-violet-600/30 blur-3xl"/>
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[10px] font-black tracking-[.2em] text-violet-300">SANSEI OPERATIONS</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">Store overview</h2><p className="mt-2 text-sm text-gray-400">Live commerce, customer and inventory performance.</p></div>
        <button onClick={()=>refetch()} disabled={isFetching} className="flex w-fit items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold hover:bg-white/10"><RefreshCw size={14} className={isFetching?'animate-spin':''}/> Refresh data</button>
      </div>
    </section>

    {error&&<div className="mt-5 flex items-center gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertTriangle size={18}/><span>Dashboard data could not be loaded. Confirm the backend is running and your admin session is valid.</span></div>}

    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({label,value,note,icon:Icon})=><article key={label} className="border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.16em] text-gray-400">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div><span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-50 text-violet-700"><Icon size={20}/></span></div><p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">{note}</p></article>)}
    </section>

    <section className="mt-6 grid gap-5 xl:grid-cols-[1.6fr_.8fr]">
      <article className="border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between"><div><p className="text-[10px] font-black tracking-[.16em] text-violet-600">LAST SIX MONTHS</p><h3 className="mt-1 text-lg font-black">Revenue performance</h3></div><span className="rounded bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-500">Revenue & orders</span></div>
        <div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={dashboard?.monthlySales || []} margin={{top:5,right:8,left:-12,bottom:0}}><defs><linearGradient id="violetRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35}/><stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#ECECF0" vertical={false}/><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#6B7280'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#6B7280'}} tickFormatter={v=>`₹${Number(v)/1000}k`}/><Tooltip formatter={(v)=>money(Number(v))} contentStyle={{border:'1px solid #E5E7EB',borderRadius:6,fontSize:12}}/><Area type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} fill="url(#violetRevenue)"/></AreaChart></ResponsiveContainer></div>
      </article>

      <article className="border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-[10px] font-black tracking-[.16em] text-violet-600">CATALOG MIX</p><h3 className="mt-1 text-lg font-black">Products by category</h3>
        <div className="mt-3 h-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dashboard?.categoryDistribution || []} dataKey="products" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3} stroke="none">{(dashboard?.categoryDistribution || []).map((item,index)=><Cell key={item.id} fill={COLORS[index%COLORS.length]}/>)}</Pie><Tooltip contentStyle={{border:'1px solid #E5E7EB',borderRadius:6,fontSize:12}}/></PieChart></ResponsiveContainer></div>
        <div className="grid grid-cols-2 gap-2">{(dashboard?.categoryDistribution || []).slice(0,6).map((item,index)=><div key={item.id} className="flex items-center gap-2 text-xs text-gray-600"><span className="h-2 w-2 rounded-full" style={{backgroundColor:COLORS[index%COLORS.length]}}/><span className="truncate">{item.name}</span><b className="ml-auto text-gray-900">{item.products}</b></div>)}</div>
      </article>
    </section>

    <section className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
      <article className="overflow-hidden border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4"><div><p className="text-[10px] font-black tracking-[.16em] text-violet-600">ORDER FLOW</p><h3 className="mt-1 text-lg font-black">Recent orders</h3></div><Link to="/admin/orders/list" className="flex items-center gap-1 text-xs font-bold text-violet-700">View all <ArrowRight size={14}/></Link></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-xs"><thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{(dashboard?.recentOrders || []).map(order=><tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-5 py-4 font-extrabold text-gray-900">{order.orderNumber}</td><td className="px-5 py-4"><p className="font-bold text-gray-800">{order.user.name}</p><p className="text-gray-400">{order.user.email}</p></td><td className="px-5 py-4 font-extrabold">{money(order.totalAmount)}</td><td className="px-5 py-4"><Badge value={order.paymentStatus}/></td><td className="px-5 py-4"><Badge value={order.status}/></td></tr>)}</tbody></table>{!dashboard?.recentOrders.length&&<p className="p-8 text-center text-sm text-gray-400">No orders yet.</p>}</div>
      </article>

      <aside className="space-y-5">
        <article className="border border-gray-200 bg-white p-5 shadow-sm"><p className="text-[10px] font-black tracking-[.16em] text-violet-600">INVENTORY HEALTH</p><h3 className="mt-1 text-lg font-black">Stock overview</h3><div className="mt-5 space-y-4"><Metric label="Available units" value={Math.max(summary.totalStock-summary.reservedStock,0)} total={Math.max(summary.totalStock,1)} color="#7C3AED"/><Metric label="Reserved units" value={summary.reservedStock} total={Math.max(summary.totalStock,1)} color="#A78BFA"/><div className="flex items-center justify-between border-t border-gray-100 pt-4"><span className="flex items-center gap-2 text-xs font-bold text-gray-600"><AlertTriangle size={15} className="text-amber-500"/> Low-stock variants</span><b className="text-lg">{summary.lowStock}</b></div></div></article>
      </aside>
    </section>

    <section className="mt-6"><div className="mb-4"><p className="text-[10px] font-black tracking-[.16em] text-violet-600">SHORTCUTS</p><h3 className="mt-1 text-lg font-black">Quick actions</h3></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{quickActions.map(({label,copy,path,icon:Icon})=><Link key={label} to={path} className="group flex items-center gap-4 border border-gray-200 bg-white p-4 shadow-sm transition hover:border-violet-300 hover:shadow-md"><span className="grid h-10 w-10 place-items-center rounded-lg bg-gray-50 text-gray-600 group-hover:bg-violet-50 group-hover:text-violet-700"><Icon size={19}/></span><span><b className="block text-sm">{label}</b><small className="text-gray-400">{copy}</small></span><ArrowRight size={15} className="ml-auto text-gray-300 group-hover:text-violet-600"/></Link>)}</div></section>
  </div>
}

function Badge({value}:{value:string}){const good=['SUCCESS','DELIVERED','CONFIRMED'].includes(value),bad=['FAILED','CANCELLED','REFUNDED'].includes(value);return <span className={`rounded-full px-2 py-1 text-[9px] font-black ${good?'bg-emerald-50 text-emerald-700':bad?'bg-red-50 text-red-700':'bg-amber-50 text-amber-700'}`}>{value.replaceAll('_',' ')}</span>}
function Metric({label,value,total,color}:{label:string;value:number;total:number;color:string}){return <div><div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-gray-500">{label}</span><b>{value}</b></div><div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full" style={{width:`${Math.min((value/total)*100,100)}%`,backgroundColor:color}}/></div></div>}
