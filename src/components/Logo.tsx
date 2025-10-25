
import Image from 'next/image';

export function Logo() {
  return (
    <Image 
        src="/logo caliope.svg" // Next.js sirve los archivos de /public en la raíz
        alt="Caliope Logo" 
        width={150} 
        height={38}
        priority
    />
  );
}
