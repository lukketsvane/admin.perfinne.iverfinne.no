'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function BlockPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Project state
  const [projects, setProjects] = useState([
    { id: 1, title: 'Sculpture Series', category: 'Sculpture', status: 'In Progress' },
    { id: 2, title: 'Abstract Paintings', category: 'Painting', status: 'Completed' },
  ])
  const [newProject, setNewProject] = useState({ title: '', category: '', status: '' })

  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState([
    { id: 1, title: 'Urban Landscape', description: 'A series exploring city life', image: 'https://example.com/image1.jpg' },
    { id: 2, title: 'Nature\'s Harmony', description: 'Sculptures inspired by natural forms', image: 'https://example.com/image2.jpg' },
  ])
  const [newPortfolioItem, setNewPortfolioItem] = useState({ title: '', description: '', image: '' })

  // Content editing state
  const [content, setContent] = useState({
    about: 'I am an artist exploring the intersection of traditional and digital media...',
    artistStatement: 'My work seeks to challenge perceptions of reality and illusion...',
    cv: '2020 - Solo Exhibition, Gallery XYZ\n2019 - Artist Residency, ABC Foundation',
  })
  const [editingContent, setEditingContent] = useState('')
  const [editingContentType, setEditingContentType] = useState('')

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (loggedIn) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'admin@example.com' && password === 'password') {
      localStorage.setItem('isLoggedIn', 'true')
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('Invalid email or password')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
  }

  const handleAddProject = () => {
    setProjects([...projects, { ...newProject, id: projects.length + 1 }])
    setNewProject({ title: '', category: '', status: '' })
  }

  const handleAddPortfolioItem = () => {
    setPortfolioItems([...portfolioItems, { ...newPortfolioItem, id: portfolioItems.length + 1 }])
    setNewPortfolioItem({ title: '', description: '', image: '' })
  }

  const handleSaveContent = () => {
    setContent({ ...content, [editingContentType]: editingContent })
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">Sign in</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-semibold">Admin Dashboard</CardTitle>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
          <CardDescription>Manage your projects, portfolio, and content</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="projects" className="space-y-4">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>{project.title}</TableCell>
                          <TableCell>{project.category}</TableCell>
                          <TableCell>{project.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add New Project</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Project</DialogTitle>
                        <DialogDescription>Enter the details for the new project.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="projectTitle">Title</Label>
                          <Input
                            id="projectTitle"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectCategory">Category</Label>
                          <Select onValueChange={(value) => setNewProject({ ...newProject, category: value })}>
                            <SelectTrigger id="projectCategory">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Painting">Painting</SelectItem>
                              <SelectItem value="Sculpture">Sculpture</SelectItem>
                              <SelectItem value="Digital">Digital</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectStatus">Status</Label>
                          <Select onValueChange={(value) => setNewProject({ ...newProject, status: value })}>
                            <SelectTrigger id="projectStatus">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="Planned">Planned</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddProject}>Add Project</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Image</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolioItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.image}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Portfolio Item</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Portfolio Item</DialogTitle>
                        <DialogDescription>Enter the details for the new portfolio item.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="itemTitle">Title</Label>
                          <Input
                            id="itemTitle"
                            value={newPortfolioItem.title}
                            onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="itemDescription">Description</Label>
                          <Textarea
                            id="itemDescription"
                            value={newPortfolioItem.description}
                            onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, description: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="itemImage">Image URL</Label>
                          <Input
                            id="itemImage"
                            value={newPortfolioItem.image}
                            onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, image: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddPortfolioItem}>Add Item</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(content).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                        <div className="flex space-x-2">
                          <Textarea id={key} value={value} readOnly className="flex-grow" />
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">Edit</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit {key.charAt(0).toUpperCase() + key.slice(1)}</DialogTitle>
                              </DialogHeader>
                              <Textarea
                                value={editingContent || value}
                                onChange={(e) => setEditingContent(e.target.value)}
                                rows={10}
                              />
                              <DialogFooter>
                                <Button onClick={() => {
                                  setEditingContentType(key)
                                  handleSaveContent()
                                }}>
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}