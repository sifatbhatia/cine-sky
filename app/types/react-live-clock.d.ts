declare module 'react-live-clock' {
  interface ClockProps {
    format?: string;
    timezone?: string;
    ticking?: boolean;
    interval?: number;
    date?: string | Date;
    className?: string;
    style?: React.CSSProperties;
  }

  const Clock: React.FC<ClockProps>;
  export default Clock;
} 