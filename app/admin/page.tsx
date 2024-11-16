'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Project = {
  id: number
  slug: string
  title: string
  category: string
  short_description: string
  long_description: string
  grid_image: string
  main_image: string
  detail_image1: string
  detail_image2: string
  price: number
  date: string
  client: string
  features: string
}

type Award = {
  id: number
  project_id: number
  award_name: string
  year: number
}

type ProjectImage = {
  id: number
  project_id: number
  image_url: string
  image_type: string
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [awards, setAwards] = useState<Award[]>([])
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
      
      if (projectsError) throw projectsError

      // Fetch awards
      const { data: awardsData, error: awardsError } = await supabase
        .from('awards')
        .select('*')
      
      if (awardsError) throw awardsError

      // Fetch project images
      const { data: imagesData, error: imagesError } = await supabase
        .from('project_images')
        .select('*')
      
      if (imagesError) throw imagesError

      setProjects(projectsData)
      setAwards(awardsData)
      setProjectImages(imagesData)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to fetch data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="awards">Awards</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage your portfolio projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>{project.category}</TableCell>
                        <TableCell>{project.client}</TableCell>
                        <TableCell>{new Date(project.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="awards">
            <Card>
              <CardHeader>
                <CardTitle>Awards</CardTitle>
                <CardDescription>View and manage project awards</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Award Name</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Project ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {awards.map((award) => (
                      <TableRow key={award.id}>
                        <TableCell className="font-medium">{award.award_name}</TableCell>
                        <TableCell>{award.year}</TableCell>
                        <TableCell>{award.project_id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Project Images</CardTitle>
                <CardDescription>Manage project images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectImages.map((image) => (
                    <Card key={image.id}>
                      <CardContent className="p-4">
                        <img 
                          src={image.image_url} 
                          alt={`Project ${image.project_id}`}
                          className="w-full h-48 object-cover rounded-md mb-2"
                        />
                        <p className="text-sm font-medium">Type: {image.image_type}</p>
                        <p className="text-sm text-muted-foreground">Project ID: {image.project_id}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}