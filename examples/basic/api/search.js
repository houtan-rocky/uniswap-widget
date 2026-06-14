export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.uniswap.org/v2/Search.v1.SearchService/SearchTokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://react-uniswap-widget.vercel.app',
        'api-key': process.env.UNISWAP_API_KEY
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error searching tokens:', error);
    return res.status(500).json({ error: 'Failed to search tokens' });
  }
} 