import { useState, FormEvent } from 'react'
import { Application } from '../types'

interface ApplicationFormProps {
  initialData?: Application
  onSubmit: (data: Application) => void
}

function ApplicationForm({ initialData, onSubmit }: ApplicationFormProps) {
  const isEditMode = !!initialData?.id

  const [formData, setFormData] = useState<Application>(
    initialData || {
      date: new Date().toISOString().split('T')[0],
      poste: '',
      employeur: '',
      adresse: '',
      type_offre: 'offre',
      suivi_1: '',
      suivi_2: '',
      suivi_3: '',
      suivi_4: '',
      telephone: '',
      contact: '',
    },
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='p-5 bg-white rounded-xl shadow-md max-w-4xl mx-auto'
    >
      <div className='flex justify-between items-center mb-4 pb-2 border-b border-gray-200'>
        <h2 className='text-xl font-bold text-gray-800'>
          {isEditMode ? 'Edit Application' : 'New Application'}
        </h2>
        <button
          type='submit'
          className='px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium shadow hover:shadow-md transition-all duration-200'
        >
          {isEditMode ? 'Update' : 'Save'}
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3'>
        <div>
          {!isEditMode && (
            <div className='mb-3'>
              <label
                htmlFor='date'
                className='text-xs font-medium text-gray-700 mb-1 block'
              >
                Date
              </label>
              <input
                type='date'
                id='date'
                name='date'
                value={formData.date}
                onChange={handleChange}
                className='w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
          )}

          <div className='mb-3'>
            <label
              htmlFor='poste'
              className='text-xs font-medium text-gray-700 mb-1 block'
            >
              Position
            </label>
            <input
              type='text'
              id='poste'
              name='poste'
              value={formData.poste}
              onChange={handleChange}
              placeholder='Job title'
              className='w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          <div className='mb-3'>
            <label
              htmlFor='employeur'
              className='text-xs font-medium text-gray-700 mb-1 block'
            >
              Employer
            </label>
            <input
              type='text'
              id='employeur'
              name='employeur'
              value={formData.employeur}
              onChange={handleChange}
              placeholder='Company name'
              className='w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          <div className='mb-3'>
            <label
              htmlFor='type_offre'
              className='text-xs font-medium text-gray-700 mb-1 block'
            >
              Application Type
            </label>
            <div className='relative'>
              <select
                id='type_offre'
                name='type_offre'
                value={formData.type_offre}
                onChange={handleChange}
                className='w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md appearance-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='offre'>Published Job</option>
                <option value='candidature_spontanee'>
                  Unsolicited Application
                </option>
                <option value='reseau'>Network</option>
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                <svg
                  className='fill-current h-4 w-4'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                >
                  <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className='mb-3'>
            <label
              htmlFor='adresse'
              className='text-xs font-medium text-gray-700 mb-1 block'
            >
              Address
            </label>
            <input
              type='text'
              id='adresse'
              name='adresse'
              value={formData.adresse}
              onChange={handleChange}
              placeholder='Company address'
              className='w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='mb-3'>
            <label
              htmlFor='telephone'
              className='text-xs font-medium text-gray-700 mb-1 block'
            >
              Phone
            </label>
            <input
              type='tel'
              id='telephone'
              name='telephone'
              value={formData.telephone}
              onChange={handleChange}
              placeholder='Phone number'
              className='w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='mb-3'>
            <label
              htmlFor='contact'
              className='text-xs font-medium text-gray-700 mb-1 block'
            >
              Contact Person
            </label>
            <input
              type='text'
              id='contact'
              name='contact'
              value={formData.contact}
              onChange={handleChange}
              placeholder='Contact name'
              className='w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>

        <div>
          {['suivi_1', 'suivi_2', 'suivi_3', 'suivi_4'].map((suivi, index) => (
            <div key={suivi} className='mb-3'>
              <label
                htmlFor={suivi}
                className='text-xs font-medium text-gray-700 mb-1 block flex items-center'
              >
                <span className='inline-block w-4 h-4 mr-1 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center'>
                  {index + 1}
                </span>
                Follow-up {index + 1}
              </label>
              <input
                type='text'
                id={suivi}
                name={suivi}
                value={(formData as any)[suivi]}
                onChange={handleChange}
                placeholder={`Follow-up ${index + 1} details`}
                className='w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          ))}
        </div>
      </div>

      {isEditMode && <input type='hidden' name='date' value={formData.date} />}
    </form>
  )
}

export default ApplicationForm
