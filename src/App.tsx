import { useState, useEffect } from 'react'
import Modal from './components/Modal'
import ApplicationForm from './components/ApplicationForm'
import { formatDate } from './functions/formatDate'
import { Application } from './types'
import { mockApplications } from './data/mockApplications'

function App() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | undefined>(
    undefined,
  )
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isPortfolioMode, setIsPortfolioMode] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      if (isPortfolioMode) {
        setApplications(
          [...mockApplications].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        )
        return
      }

      const response = await fetch('/api/applications')
      const data = await response.json()

      if (Array.isArray(data)) {
        setApplications(
          [...data].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        )
      } else {
        console.error('Received data is not an array:', data)
      }
    } catch (err) {
      console.error('Error fetching applications:', err)
      if (isPortfolioMode) {
        setApplications(
          [...mockApplications].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          ),
        )
      }
    }
  }

  const handleAddClick = () => {
    setSelectedApp(undefined)
    setModalOpen(true)
  }

  const handleRowClick = (app: Application) => {
    setSelectedApp(app)
    setModalOpen(true)
  }

  const handleSubmit = async (data: Application) => {
    try {
      if (isPortfolioMode) {
        if (data.id) {
          setApplications(prev =>
            prev.map(app => (app.id === data.id ? { ...data } : app)),
          )
        } else {
          const newId =
            Math.max(...applications.map(app => app.id as number), 0) + 1
          const newApp = { ...data, id: newId }
          setApplications(prev => [...prev, newApp])
        }
        setModalOpen(false)
        return
      }

      let response

      if (data.id) {
        response = await fetch(`/api/applications/${data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      } else {
        const { id, ...dataWithoutId } = data as any
        response = await fetch('/api/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataWithoutId),
        })
      }

      if (response.ok) {
        await fetchApplications()
        setModalOpen(false)
      } else {
        let errorText = ''
        try {
          const errorData = await response.json()
          errorText = JSON.stringify(errorData)
        } catch (e) {
          errorText = await response.text()
        }

        console.error('Error submitting application:', errorText)
        alert(
          `An error occurred while saving the application: ${response.status} ${errorText}`,
        )
      }
    } catch (err) {
      console.error('Error handling submit:', err)
      alert('An error occurred while saving the application.')
    }
  }

  const handleDelete = async (id: number) => {
    if (id === null) return

    try {
      if (isPortfolioMode) {
        setApplications(prev => prev.filter(app => app.id !== id))
        setDeleteId(null)
        return
      }

      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchApplications()
        setDeleteId(null)
      } else {
        console.error('Error deleting application')
        alert('An error occurred while deleting the application.')
      }
    } catch (err) {
      console.error('Error handling delete:', err)
      alert('An error occurred while deleting the application.')
    }
  }

  const isOfferOldAndNoFollowUp = (
    dateString: string,
    suivi1: string | undefined,
  ): boolean => {
    const date = new Date(dateString)
    const today = new Date()
    const twoWeeksAgo = new Date(today.setDate(today.getDate() - 14))

    return date < twoWeeksAgo && !suivi1
  }

  const togglePortfolioMode = () => {
    const newMode = !isPortfolioMode
    setIsPortfolioMode(newMode)

    if (newMode) {
      setApplications(
        [...mockApplications].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      )
    } else {
      fetchApplications()
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center mb-8 bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg'>
          <div>
            <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 mb-4 md:mb-0'>
              Job Applications
            </h1>
            {isPortfolioMode && (
              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
                Portfolio Demo Mode
              </span>
            )}
          </div>
          <div className='flex space-x-4'>
            <button
              onClick={togglePortfolioMode}
              className={`px-4 py-2 rounded-lg text-sm font-medium shadow transition-all duration-200 ${
                isPortfolioMode
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isPortfolioMode ? 'Exit Demo Mode' : 'Switch to Demo Mode'}
            </button>
            <button
              onClick={handleAddClick}
              className='px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium tracking-wide shadow hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-1 flex items-center'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
              Add
            </button>
          </div>
        </div>

        <div className='mb-8 p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border-l-4 border-blue-500'>
          <h2 className='text-xl font-bold text-gray-800 mb-2'>
            Job Applications Tracker
          </h2>
          {isPortfolioMode ? (
            <div>
              <div className='mb-4 bg-purple-50 p-4 rounded-lg border border-purple-100'>
                <h3 className='font-semibold text-purple-800 mb-2 flex items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 mr-2'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Demo Mode Active
                </h3>
                <p className='text-purple-700 text-sm'>
                  You're viewing sample job applications for demonstration
                  purposes. In this mode, you can:
                </p>
                <ul className='list-disc list-inside mt-2 text-purple-700 text-sm'>
                  <li>View sample applications</li>
                  <li>
                    Add new sample applications (stored in browser memory)
                  </li>
                  <li>Edit or delete existing samples</li>
                  <li>
                    All changes are temporary and will reset if you refresh the
                    page
                  </li>
                </ul>
              </div>
              <p className='text-gray-700 leading-relaxed mb-2'>
                This project was developed with{' '}
                <span className='font-semibold text-blue-600'>React</span>,{' '}
                <span className='font-semibold text-blue-600'>TypeScript</span>,{' '}
                <span className='font-semibold text-blue-600'>Vite</span>, and a
                good amount of{' '}
                <span className='font-semibold text-blue-600'>
                  Tailwind CSS
                </span>{' '}
                for styling.
              </p>
            </div>
          ) : (
            <p className='text-gray-700 leading-relaxed mb-2'>
              This project was developed with{' '}
              <span className='font-semibold text-blue-600'>React</span>,{' '}
              <span className='font-semibold text-blue-600'>TypeScript</span>,{' '}
              <span className='font-semibold text-blue-600'>Vite</span>, and a
              good amount of{' '}
              <span className='font-semibold text-blue-600'>Tailwind CSS</span>{' '}
              for styling.
            </p>
          )}
          <p className='text-gray-700 leading-relaxed'>
            If you're curious about the code, it's all on my{' '}
            <a
              href='https://github.com/ton-github'
              target='_blank'
              className='text-blue-600 hover:text-blue-800 underline transition-colors duration-300'
            >
              GitHub
            </a>
            !
          </p>
        </div>

        <div className='bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    ID
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Position
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Employer
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Address
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Follow-up 1
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Follow-up 2
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Follow-up 3
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Follow-up 4
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Phone
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Contact
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {applications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={13}
                      className='px-4 py-8 text-center text-gray-500'
                    >
                      {isPortfolioMode ? (
                        <div className='flex flex-col items-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-12 w-12 text-gray-400 mb-3'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1}
                              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                            />
                          </svg>
                          <span>
                            No sample applications available. Click "Add" to
                            create one.
                          </span>
                        </div>
                      ) : (
                        <div className='flex flex-col items-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-12 w-12 text-gray-400 mb-3'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1}
                              d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
                            />
                          </svg>
                          <span>
                            No job applications found. Click "Add" to create
                            your first application.
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  applications.map(app => (
                    <tr
                      key={app.id}
                      className={`${
                        isOfferOldAndNoFollowUp(app.date, app.suivi_1)
                          ? 'bg-yellow-50'
                          : ''
                      } hover:bg-blue-50 cursor-pointer transition-colors duration-150`}
                      onClick={() => handleRowClick(app)}
                    >
                      <td className='px-4 py-3 whitespace-nowrap'>{app.id}</td>
                      <td className='px-4 py-3 whitespace-nowrap font-medium'>
                        {formatDate(app.date)}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap font-medium text-blue-600'>
                        {app.poste}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        {app.employeur}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-gray-500'>
                        {app.adresse}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            app.type_offre === 'offre'
                              ? 'bg-green-100 text-green-800'
                              : app.type_offre === 'candidature_spontanee'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {app.type_offre === 'offre'
                            ? 'Published offer'
                            : app.type_offre === 'candidature_spontanee'
                            ? 'Unsolicited'
                            : 'Network'}
                        </span>
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        {app.suivi_1 || '—'}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        {app.suivi_2 || '—'}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        {app.suivi_3 || '—'}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        {app.suivi_4 || '—'}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        {app.telephone || '—'}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        {app.contact || '—'}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap text-right'>
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            if (
                              confirm(
                                'Are you sure you want to delete this application?',
                              )
                            ) {
                              if (app.id !== undefined) {
                                if (isPortfolioMode) {
                                  handleDelete(app.id as number)
                                } else {
                                  setDeleteId(app.id as number)
                                }
                              }
                            }
                          }}
                          className='text-red-600 hover:text-red-900 font-medium transition-colors duration-200'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className='p-2 bg-yellow-50 border-t border-yellow-100 text-xs'>
            <div className='flex items-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-yellow-500 mr-2'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              <p className='text-yellow-700'>
                <strong>Note:</strong> Applications with a yellow background
                indicate that it's time to call the employer, as they are more
                than 2 weeks old and have no follow-up yet.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className='text-2xl font-bold mb-6 text-gray-800'>
          {selectedApp ? 'Edit Application' : 'Add Application'}
        </h2>
        <ApplicationForm initialData={selectedApp} onSubmit={handleSubmit} />
      </Modal>

      {deleteId && !isPortfolioMode && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm'>
          <div className='bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transition-all duration-300 transform animate-fadeIn'>
            <h3 className='text-xl font-bold text-gray-800 mb-4'>
              Delete Confirmation
            </h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete this application? This action
              cannot be undone.
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setDeleteId(null)}
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium'
              >
                Cancel
              </button>
              <button
                onClick={() => deleteId && handleDelete(deleteId)}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
