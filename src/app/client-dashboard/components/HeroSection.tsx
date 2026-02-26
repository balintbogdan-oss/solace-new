import Image from 'next/image';

interface HeroSectionProps {
  clientName: string;
}

export function HeroSection({ clientName }: HeroSectionProps) {
  return (
    <div className="w-full relative h-32 sm:h-40 lg:h-44" style={{ backgroundColor: '#041340' }}>
      <div className="absolute inset-0">
        <Image 
          src="/images/client-hero.jpg" 
          alt="" 
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px] h-full relative z-10 flex items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-medium text-white mb-2">
            Welcome back, {clientName}
          </h1>
        </div>
      </div>
    </div>
  );
}

