import { title } from 'process';
import { JsonArray } from '@prisma/client/runtime/library';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) throw new Error('Invalid date');
    
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(parsedDate);
  } catch (error) {
    console.error('Error in formatDate:', error);
    return 'Invalid Date';
  }
}

export function formatNumber(num: number) {
  try {
    if (isNaN(num)) throw new Error('Invalid number');
    
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error('Error in formatNumber:', error);
    return 'Invalid Number';
  }
}

export function formatNumberNew(num: number) {
  try {
    if (isNaN(num)) throw new Error('Invalid number');
    
    const formattedNum = num.toFixed(2); // Ensure 2 decimal places
    const [whole, fraction] = formattedNum.split('.'); // Split into integer and decimal

    return { whole, fraction }; // Return an object with both parts
  } catch (error) {
    console.error('Error in formatNumber:', error);
    return { whole: 'Invalid', fraction: 'Number' };
  }
}

export function truncateText(text: string, maxLength: number = 30) {
  try {
    if (typeof text !== 'string') throw new Error('Invalid text');
    
    return text.length > maxLength ? text.slice(0, maxLength) + '' : text;
  } catch (error) {
    console.error('Error in truncateText:', error);
    return '';
  }
}

export function getInitials(name: string) {
  try {
    const [first = '', last = ''] = name.split(' ');    
    return `${first[0]?.toUpperCase() ?? ''}${last[0]?.toUpperCase() ?? ''}`;
  } catch (error) {
    console.error('Error in getInitials:', error);
    return '';
  }
}

export function generateDistinctBlueShade(): string {
  try {
    const hue = Math.floor(Math.random() * 11) + 210;
    const saturation = Math.floor(Math.random() * 15) + 83;
    const lightness = Math.max(30, Math.min(90, Math.floor(Math.random() * 100)));
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  } catch (error) {
    console.error('Error in generateDistinctBlueShade:', error);
    return 'hsl(210, 83%, 50%)'; // Fallback color
  }
}

export const formatProducts = (products: any[]) => {
  const formattedWithBr = products.map((product, index) => {
    // Validate product data
    if (!product || !product.title || isNaN(product.price) || isNaN(product.quantity)) {
      console.error(`Invalid product data at index ${index}`);
      return ''; // Return an empty string for invalid products
    }
    
    return `${index + 1}. ${product.title}<br />   <b>Price:</b> $${product.price.toFixed(2)}<br />   <b>Quantity:</b> ${product.quantity}`;
  }).filter(Boolean).join('<br /><br />'); // Filter out empty strings

  const formattedWithoutBr = products.map((product, index) => {
    // Validate product data
    if (!product || !product.title || isNaN(product.price) || isNaN(product.quantity)) {
      console.error(`Invalid product data at index ${index}`);
      return ''; // Return an empty string for invalid products
    }
    
    return `${index + 1}. ${product.title}   Price: $${product.price.toFixed(2)}   Quantity: ${product.quantity}`;
  }).filter(Boolean).join('\n'); // Filter out empty strings

  return { formattedWithBr, formattedWithoutBr }; // Return both formatted strings
};


/**
 * Stole this from the @radix-ui/primitive
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event)

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event)
    }
  }
}