/**
 * Mock fixtures modeled as MongoDB documents.
 *
 * In a fully wired-up suite these wouldn't be hardcoded here — a
 * `globalSetup` script would seed a `products` and `users` collection
 * (e.g. via mongodb-memory-server for isolation, or a seed script
 * against a test database) before the run, and this module would just
 * be the typed contract both the seeder and the tests share. Keeping
 * expected values in one typed place also means a test never silently
 * duplicates a value that only exists in the UI copy.
 */

export interface ProductDocument {
  _id: string;
  name: string;
  category: 'Audio' | 'Wearable' | 'Office';
  price: number;
  stock: number;
}

export interface UserDocument {
  _id: string;
  email: string;
  passwordHash: string; // never store/assert plaintext in a real DB
  plainPasswordForTest: string; // only present in the seed fixture, used to drive the login action
}

export const products: ProductDocument[] = [
  { _id: 'p1', name: 'Wireless Headphones', category: 'Audio', price: 79.99, stock: 25 },
  { _id: 'p2', name: 'Smart Watch', category: 'Wearable', price: 199.99, stock: 10 },
  { _id: 'p3', name: 'Bluetooth Speaker', category: 'Audio', price: 49.99, stock: 30 },
  { _id: 'p4', name: 'Laptop Stand', category: 'Office', price: 34.5, stock: 15 },
  { _id: 'p5', name: 'Mechanical Keyboard', category: 'Office', price: 129, stock: 8 },
];

export const testUsers: UserDocument[] = [
  {
    _id: 'u1',
    email: 'qa.tester@example.com',
    passwordHash: '<bcrypt-hash-placeholder>',
    plainPasswordForTest: 'ValidPass123!',
  },
];

/** Fields needed to submit the Sign Up form (distinct from a stored UserDocument). */
export interface SignUpDetails {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

/**
 * Creates a temporary, unique test user during runtime.
 * Since the site doesn't provide a user seeding endpoint, we avoid
 * relying on a pre-created account and instead register a fresh user
 * for each test run. This keeps tests self-contained, repeatable,
 * and prevents conflicts from duplicate emails.
 * Uses fake placeholder data only - never real user information.
 */
export function createDynamicTestUser(): SignUpDetails {
  const uniqueId = Date.now();
  return {
    fullName: 'QA Automation Test',
    email: `qa.tester+${uniqueId}@example.com`,
    phone: '0000000000',
    password: 'TestPass123!',
  };
}
export function findProductByName(name: string): ProductDocument {
  const product = products.find((p) => p.name === name);
  if (!product) throw new Error(`No mock product document found for "${name}"`);
  return product;
}
