import winston from 'winston'
import dailyRotateFile from 'winston-daily-rotate-file'
import path from 'path'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { timestamp: Date.now() },
  transports: [
    new dailyRotateFile({
      filename: path.join(process.env.logger_folder || '', '/application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

export const logSql = (sql: string) => logger.info(sql.replace(/\s+/g, ' '))

export default logger
