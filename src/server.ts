import { app } from './app.js';
import 'dotenv/config';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.warn(`Server listening on http://localhost:${PORT}`);
});
