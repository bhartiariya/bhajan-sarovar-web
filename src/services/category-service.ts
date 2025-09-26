import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Category } from '@/types'

export class CategoryService {
  private readonly categoriesCollection = 'categories'

  async fetchCategories(): Promise<Category[]> {
    try {
      console.log('📊 Fetching categories from Firebase...')
      
      const snapshot = await getDocs(collection(db, this.categoriesCollection))
      const categories = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || '',
          displayName: data.displayName || data.name || '',
          songCount: data.songCount || 0,
          songs: data.songs || [],
          artists: data.artists || [],
          totalDuration: data.totalDuration || 0,
          description: data.description || '',
          image: data.image,
          color: data.color,
          isActive: data.isActive ?? true,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Category
      })
      
      console.log(`📊 Successfully fetched ${categories.length} categories`)
      return categories
    } catch (error) {
      console.error('❌ Error fetching categories:', error)
      return []
    }
  }

  async fetchActiveCategories(): Promise<Category[]> {
    try {
      console.log('📊 Fetching active categories from Firebase...')
      
      const q = query(
        collection(db, this.categoriesCollection),
        where('isActive', '==', true)
      )
      
      const snapshot = await getDocs(q)
      const categories = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || '',
          displayName: data.displayName || data.name || '',
          songCount: data.songCount || 0,
          songs: data.songs || [],
          artists: data.artists || [],
          totalDuration: data.totalDuration || 0,
          description: data.description || '',
          image: data.image,
          color: data.color,
          isActive: data.isActive ?? true,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Category
      })
      
      console.log(`📊 Successfully fetched ${categories.length} active categories`)
      return categories
    } catch (error) {
      console.error('❌ Error fetching active categories:', error)
      return []
    }
  }

  async fetchCategoryById(categoryId: string): Promise<Category | null> {
    try {
      console.log(`📊 Fetching category by ID: ${categoryId}`)
      
      const docRef = doc(db, this.categoriesCollection, categoryId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        const category = {
          id: docSnap.id,
          name: data.name || '',
          displayName: data.displayName || data.name || '',
          songCount: data.songCount || 0,
          songs: data.songs || [],
          artists: data.artists || [],
          totalDuration: data.totalDuration || 0,
          description: data.description || '',
          image: data.image,
          color: data.color,
          isActive: data.isActive ?? true,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Category
        
        console.log(`📊 Successfully fetched category: ${category.displayName}`)
        return category
      }
      
      console.log('❌ Category not found')
      return null
    } catch (error) {
      console.error('❌ Error fetching category by ID:', error)
      return null
    }
  }
}

export const categoryService = new CategoryService()
