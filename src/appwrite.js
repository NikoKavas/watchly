import { Client, Databases, ID, Query } from "appwrite"

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const VITE_APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT) 
    .setProject(PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) => {
    // Use appwrite SDK if the searchTerm exists in the database
    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal('searchTerm', searchTerm)
        ])
        // if it does, update the count
        if (result.documents.length > 0) {
            const doc = result.documents[0]

            await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
                count: doc.count + 1
            })
        //if it doesn't, create a new entry with count 1    
        } else {
            await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    } catch (error) {
        console.error(error)
    }
}

export const getTrendingMovies = async () => {
        try {
            const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
                Query.orderDesc('count'),
                Query.limit(5)
            ])
            return result.documents
        } catch (error) {
            console.error(error)
        }
    }