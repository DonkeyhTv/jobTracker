import express, { Request, Response, NextFunction } from 'express'
import { pool } from './db'

const router = express.Router()

router.get(
  '/applications',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await pool.query(
        'SELECT * FROM applications ORDER BY date DESC',
      )
      res.json(result.rows)
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error fetching applications:', err.message)
      } else {
        console.error('Error fetching applications:', err)
      }
      res.status(500).json({
        error: 'Internal Server Error',
        details: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  },
)

router.post(
  '/applications',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      date,
      poste,
      employeur,
      adresse,
      type_offre,
      suivi_1,
      suivi_2,
      suivi_3,
      suivi_4,
      telephone,
      contact,
    } = req.body

    if (!poste || !employeur) {
      res.status(400).json({
        error: 'Les champs "poste" et "employeur" sont obligatoires.',
      })
      return
    }

    const applicationDate = date || new Date().toISOString().split('T')[0]

    try {
      const result = await pool.query(
        `INSERT INTO applications
       (date, poste, employeur, adresse, type_offre,
        suivi_1, suivi_2, suivi_3, suivi_4, telephone, contact)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [
          applicationDate,
          poste,
          employeur,
          adresse || '',
          type_offre || '',
          suivi_1 || '',
          suivi_2 || '',
          suivi_3 || '',
          suivi_4 || '',
          telephone || '',
          contact || '',
        ],
      )

      console.log('Inserted new application with ID:', result.rows[0].id)
      res.status(201).json(result.rows[0])
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error creating application:', err.message)
        res
          .status(500)
          .json({ error: 'Internal Server Error', details: err.message })
      } else {
        console.error('Error creating application:', err)
        res.status(500).json({ error: 'Internal Server Error' })
      }
    }
  },
)

router.put(
  '/applications/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    const {
      date,
      poste,
      employeur,
      adresse,
      type_offre,
      suivi_1,
      suivi_2,
      suivi_3,
      suivi_4,
      telephone,
      contact,
    } = req.body

    if (!poste || !employeur) {
      res.status(400).json({
        error: 'Les champs "poste" et "employeur" sont obligatoires.',
      })
      return
    }

    console.log('Received PUT data:', {
      id,
      date,
      poste,
      employeur,
      adresse,
      type_offre,
      suivi_1,
      suivi_2,
      suivi_3,
      suivi_4,
      telephone,
      contact,
    })

    try {
      const numericId = parseInt(id, 10)
      if (isNaN(numericId)) {
        res.status(400).json({
          error: 'Invalid ID format',
          details: 'ID must be a number',
        })
        return
      }

      const existingApp = await pool.query(
        'SELECT date FROM applications WHERE id = $1',
        [numericId],
      )

      if (existingApp.rows.length === 0) {
        res.status(404).json({ error: 'Application not found' })
        return
      }

      const originalDate = existingApp.rows[0].date

      const updateResult = await pool.query(
        `UPDATE applications SET
           date=$1, poste=$2, employeur=$3, adresse=$4, type_offre=$5,
           suivi_1=$6, suivi_2=$7, suivi_3=$8, suivi_4=$9,
           telephone=$10, contact=$11 WHERE id=$12 RETURNING *`,
        [
          originalDate,
          poste,
          employeur,
          adresse || '',
          type_offre || '',
          suivi_1 || '',
          suivi_2 || '',
          suivi_3 || '',
          suivi_4 || '',
          telephone || '',
          contact || '',
          numericId,
        ],
      )

      console.log('Updated application with ID:', updateResult.rows[0].id)
      res.json(updateResult.rows[0])
    } catch (err) {
      console.error('Error updating application:', err)
      if (err instanceof Error) {
        res
          .status(500)
          .json({ error: 'Internal Server Error', details: err.message })
      } else {
        res.status(500).json({ error: 'Internal Server Error' })
      }
    }
  },
)

router.delete(
  '/applications/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params

    try {
      const numericId = parseInt(id, 10)
      if (isNaN(numericId)) {
        res.status(400).json({
          error: 'Invalid ID format',
          details: 'ID must be a number',
        })
        return
      }

      const deleteResult = await pool.query(
        'DELETE FROM applications WHERE id = $1 RETURNING id',
        [numericId],
      )

      if (deleteResult.rows.length === 0) {
        res.status(404).json({ error: 'Application not found' })
        return
      }

      console.log('Deleted application with ID:', id)
      res.sendStatus(204)
    } catch (err) {
      console.error('Error deleting application:', err)
      if (err instanceof Error) {
        res
          .status(500)
          .json({ error: 'Internal Server Error', details: err.message })
      } else {
        res.status(500).json({ error: 'Internal Server Error' })
      }
    }
  },
)

export default router
