import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const DynamicAdminDashboard = dynamic(() => import('@/components/admin-dashboard'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
})

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <DynamicAdminDashboard />
    </Suspense>
  )
}