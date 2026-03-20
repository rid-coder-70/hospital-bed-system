import dynamic from 'next/dynamic'

const HospitalMapClient = dynamic(() => import('./HospitalMapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse flex items-center justify-center border border-gray-200 dark:border-slate-800 shadow-inner">
       <span className="font-bold text-gray-400">Loading Geospatial Interface...</span>
    </div>
  )
})

export default HospitalMapClient
