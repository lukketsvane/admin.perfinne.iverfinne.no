'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bold, Italic, LinkIcon, ImageIcon, YoutubeIcon, List, ListOrdered, Heading2 } from 'lucide-react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

interface PortfolioItem {
  id: string
  slug: string
  title: string
  category: string
  content: string
  status: 'draft' | 'published'
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-t-md">
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-300' : ''}
        size="sm"
        variant="outline"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-300' : ''}
        size="sm"
        variant="outline"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}
        size="sm"
        variant="outline"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-300' : ''}
        size="sm"
        variant="outline"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-gray-300' : ''}
        size="sm"
        variant="outline"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => {
          const url = window.prompt('Enter the URL of the image:')
          if (url) {
            editor.chain().focus().setImage({ src: url }).run()
          }
        }}
        size="sm"
        variant="outline"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => {
          const url = window.prompt('Enter the URL:')
          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
        size="sm"
        variant="outline"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => {
          const url = window.prompt('Enter the YouTube URL:')
          if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run()
          }
        }}
        size="sm"
        variant="outline"
      >
        <YoutubeIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function AdminDashboard() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Youtube,
      Placeholder.configure({
        placeholder: 'Write your content here...',
      }),
    ],
    content: editingItem?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl w-full h-full min-h-[200px] p-4 border rounded-b-md focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      if (editingItem) {
        setEditingItem({ ...editingItem, content: editor.getHTML() })
      }
    },
  })

  useEffect(() => {
    fetchPortfolioItems()
  }, [])

  useEffect(() => {
    if (editor && editingItem) {
      editor.commands.setContent(editingItem.content)
    }
  }, [editingItem, editor])

  async function fetchPortfolioItems() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('title', { ascending: true })
    if (error) console.error('Error fetching portfolio items:', error)
    else setPortfolioItems(data || [])
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

  function truncateContent(content: string, maxLength: number = 100): string {
    if (!content) return ''
    const strippedContent = content.replace(/<[^>]+>/g, '')
    return strippedContent.length > maxLength
      ? strippedContent.substring(0, maxLength) + '...'
      : strippedContent
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioItems.map((item) => (
                  <Card key={item.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-sm mt-2">{truncateContent(item.content)}</p>
                    </CardContent>
                    <div className="p-4 flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Page</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Edit your about page content here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage your website settings here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Portfolio Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 flex-grow overflow-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                className="col-span-3"
                value={editingItem?.title || ''}
                onChange={(e) => setEditingItem(editingItem ? {...editingItem, title: e.target.value} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input
                id="category"
                className="col-span-3"
                value={editingItem?.category || ''}
                onChange={(e) => setEditingItem(editingItem ? {...editingItem, category: e.target.value} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select
                value={editingItem?.status || 'draft'}
                onValueChange={(value) => setEditingItem(editingItem ? {...editingItem, status: value as 'draft' | 'published'} : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <Label htmlFor="content">Content</Label>
              <div className="border rounded-md mt-1">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateItem}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}