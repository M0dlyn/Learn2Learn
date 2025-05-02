import { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface Learn2LearnLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  mode?: 'light' | 'dark' | 'auto';
}

export default function Learn2LearnLogo({ 
  mode = 'auto', 
  className, 
  ...props 
}: Learn2LearnLogoProps) {
  const blackLogoImage = '/Learn2Learn_Logo_black.png';
  const whiteLogoImage = '/Learn2Learn_Logo_white.png';
  
  if (mode === 'auto') {
    return (
      <>
        <img
          src={blackLogoImage}
          alt="Learn2Learn Logo"
          className={cn(className, "dark:hidden")}
          {...props}
        />
        <img
          src={whiteLogoImage}
          alt="Learn2Learn Logo" 
          className={cn(className, "hidden dark:block")}
          {...props}
        />
      </>
    );
  }
  
  return (
    <img
      src={mode === 'dark' ? whiteLogoImage : blackLogoImage}
      alt="Learn2Learn Logo"
      className={className}
      {...props}
    />
  );
}