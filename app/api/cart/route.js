import { GET as getCart } from './getCart';
import { POST as addItem } from './addItem';
import { DELETE as removeItem } from './removeItem';

export async function GET(req) {
  return getCart(req);
}

export async function POST(req) {
  return addItem(req);
}

export async function DELETE(req) {
  return removeItem(req);
}
