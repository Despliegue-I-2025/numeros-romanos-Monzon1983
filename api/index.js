export default function handler(req, res) {
  res.status(200).json({
    message: '✅ API de Conversión de Números Romanos lista y funcionando',
    endpoints_disponibles: [
      '/api/a2r?arabic=2025',
      '/api/r2a?roman=MMXXV'
    ],
    autor: 'Mauro Monzón'
  });
}


