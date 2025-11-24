import Image from 'next/image';

interface HeroSectionProps {
  clientName: string;
}

export function HeroSection({ clientName }: HeroSectionProps) {
  return (
    <div className="w-full relative h-44" style={{ backgroundColor: '#041340' }}>
      <div className="max-w-[1440px] mx-auto px-[100px] h-full relative flex items-center">
        <div className="relative z-10">
          <h1 className="text-2xl font-medium text-white mb-2">
            Welcome back, {clientName}
          </h1>
        </div>
        <div className="absolute inset-0">
          <Image 
            src="/images/client-hero.jpg" 
            alt="" 
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

