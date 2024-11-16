'use client'

import { useState, useEffect } from 'react'
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

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface PortfolioItem {
  id: string
  slug: string
  title: string
  category: string
  description: string
  grid_image: string
  main_image: string
  date: string
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

export default function AdminPortfolioGrid() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({})
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: editingItem?.description || '',
    onUpdate: ({ editor }) => {
      if (editingItem) {
        setEditingItem({ ...editingItem, description: editor.getHTML() })
      } else {
        setNewItem({ ...newItem, description: editor.getHTML() })
      }
    },
  })

  useEffect(() => {
    fetchPortfolioItems()
  }, [])

  useEffect(() => {
    if (editor && editingItem) {
      editor.commands.setContent(editingItem.description)
    }
  }, [editingItem, editor])

  async function fetchPortfolioItems() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('date', { ascending: false })
    if (error) console.error('Error fetching portfolio items:', error)
    else setPortfolioItems(data || [])
  }

  async function handleAddItem() {
    const { data, error } = await supabase
      .from('projects')
      .insert([newItem])
    if (error) console.error('Error adding portfolio item:', error)
    else {
      fetchPortfolioItems()
      setNewItem({})
      setIsDialogOpen(false)
    }
  }

  async function handleUpdateItem() {
    if (!editingItem) return
    const { data, error } = await supabase
      .from('projects')
      .update(editingItem)
      .eq('id', editingItem.id)
    if (error) console.error('Error updating portfolio item:', error)
    else {
      fetchPortfolioItems()
      setEditingItem(null)
      setIsDialogOpen(false)
    }
  }

  async function handleDeleteItem(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    if (error) console.error('Error deleting portfolio item:', error)
    else fetchPortfolioItems()
  }

  async function handleImageUpload(file: File, type: 'grid' | 'main') {
    const filename = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filename, file)

    if (error) {
      console.error('Error uploading image:', error)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filename)

    if (editingItem) {
      setEditingItem({ ...editingItem, [type === 'grid' ? 'grid_image' : 'main_image']: publicUrl })
    } else {
      setNewItem({ ...newItem, [type === 'grid' ? 'grid_image' : 'main_image']: publicUrl })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Grid Admin</CardTitle>
          <CardDescription>Manage your portfolio items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}>Add New Item</Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the details of this portfolio item.' : 'Enter the details for the new portfolio item.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                className="col-span-3"
                value={editingItem?.title || newItem.title || ''}
                onChange={(e) => editingItem ? setEditingItem({...editingItem, title: e.target.value}) : setNewItem({...newItem, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input
                id="category"
                className="col-span-3"
                value={editingItem?.category || newItem.category || ''}
                onChange={(e) => editingItem ? setEditingItem({...editingItem, category: e.target.value}) : setNewItem({...newItem, category: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Date</Label>
              <Input
                id="date"
                type="date"
                className="col-span-3"
                value={editingItem?.date || newItem.date || ''}
                onChange={(e) => editingItem ? setEditingItem({...editingItem, date: e.target.value}) : setNewItem({...newItem, date: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <div className="col-span-3">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grid-image" className="text-right">Grid Image</Label>
              <div className="col-span-3">
                <Input
                  id="grid-image"
                  type="file"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'grid')}
                />
                {(editingItem?.grid_image || newItem.grid_image) && (
                  <img src={editingItem?.grid_image || newItem.grid_image} alt="Grid Preview" className="mt-2 max-w-xs" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="main-image" className="text-right">Main Image</Label>
              <div className="col-span-3">
                <Input
                  id="main-image"
                  type="file"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'main')}
                />
                {(editingItem?.main_image || newItem.main_image) && (
                  <img src={editingItem?.main_image || newItem.main_image} alt="Main Preview" className="mt-2 max-w-xs" />
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={editingItem ? handleUpdateItem : handleAddItem}>
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}