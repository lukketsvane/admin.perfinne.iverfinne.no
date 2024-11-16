'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bold, Italic, Underline, List, ListOrdered, ImageIcon } from 'lucide-react'
import './tiptap.css'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

type Project = {
  id: number
  slug: string
  title: string
  category: string
  content: string
  grid_image: string
  main_image: string
  detail_image1: string
  detail_image2: string
  price: number | null
  date: string
  client: string
  features: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex space-x-2 mb-2">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        size="icon"
        variant="outline"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState<Partial<Project>>({})
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: editingProject?.content || '',
    onUpdate: ({ editor }) => {
      if (editingProject) {
        setEditingProject({ ...editingProject, content: editor.getHTML() })
      } else {
        setNewProject({ ...newProject, content: editor.getHTML() })
      }
    },
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (editor && editingProject) {
      editor.commands.setContent(editingProject.content)
    }
  }, [editingProject, editor])

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
    if (error) console.error('Error fetching projects:', error)
    else setProjects(data || [])
  }

  async function handleAddProject() {
    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
    if (error) console.error('Error adding project:', error)
    else {
      fetchProjects()
      setNewProject({})
    }
  }

  async function handleUpdateProject() {
    if (!editingProject) return
    const { data, error } = await supabase
      .from('projects')
      .update(editingProject)
      .eq('id', editingProject.id)
    if (error) console.error('Error updating project:', error)
    else {
      fetchProjects()
      setEditingProject(null)
    }
  }

  async function handleDeleteProject(id: number) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    if (error) console.error('Error deleting project:', error)
    else fetchProjects()
  }

  async function handleImageUpload(file: File) {
    const filename = `${Date.now()}-${file.name}`
    const response = await fetch(`/api/upload?filename=${filename}`, {
      method: 'POST',
      body: file,
    })

    if (response.ok) {
      const { url } = await response.json()
      editor?.chain().focus().setImage({ src: url }).run()
    } else {
      console.error('Error uploading image')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">Project Admin Dashboard</CardTitle>
          <CardDescription>Manage your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>{new Date(project.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2" onClick={() => setEditingProject(project)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteProject(project.id)}>Delete</Button>
                  </TableCell>
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
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>Enter the details for the new project.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" className="col-span-3" value={newProject.title || ''} onChange={(e) => setNewProject({...newProject, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Category</Label>
                  <Input id="category" className="col-span-3" value={newProject.category || ''} onChange={(e) => setNewProject({...newProject, category: e.target.value})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client" className="text-right">Client</Label>
                  <Input id="client" className="col-span-3" value={newProject.client || ''} onChange={(e) => setNewProject({...newProject, client: e.target.value})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Input id="date" type="date" className="col-span-3" value={newProject.date || ''} onChange={(e) => setNewProject({...newProject, date: e.target.value})} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">Content</Label>
                  <div className="col-span-3">
                    <MenuBar editor={editor} />
                    <EditorContent editor={editor} />
                    <div className="mt-2">
                      <Label htmlFor="image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Upload Image
                      </Label>
                      <Input id="image-upload" type="file" className="hidden" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddProject}>Add Project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>Update the details for this project.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">Title</Label>
                <Input id="edit-title" className="col-span-3" value={editingProject.title} onChange={(e) => setEditingProject({...editingProject, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Category</Label>
                <Input id="edit-category" className="col-span-3" value={editingProject.category} onChange={(e) => setEditingProject({...editingProject, category: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-client" className="text-right">Client</Label>
                <Input id="edit-client" className="col-span-3" value={editingProject.client} onChange={(e) => setEditingProject({...editingProject, client: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">Date</Label>
                <Input id="edit-date" type="date" className="col-span-3" value={editingProject.date} onChange={(e) => setEditingProject({...editingProject, date: e.target.value})} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-content" className="text-right">Content</Label>
                <div className="col-span-3">
                  <MenuBar editor={editor} />
                  <EditorContent editor={editor} />
                  <div className="mt-2">
                    <Label htmlFor="edit-image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload Image
                    </Label>
                    <Input id="edit-image-upload" type="file" className="hidden" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateProject}>Update Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}