import { connect, Options, Connection } from 'amqplib'
import { RabbitConfig } from '@ioc:Adonis/Addons/Rabbit'
import InvalidRabbitConfigException from '../Exceptions/InvalidRabbitConfigException'

export default class RabbitConnection {
  /**
   * Whether the connection has already been established
   */
  public hasConnection: boolean = false

  /**
   * The connection
   */
  private $connection: Connection

  /**
   * The credentials
   */
  private readonly $credentials: string

  /**
   * The hostname
   */
  private readonly $hostname: string

  /**
   * The username
   */
  private readonly $username: string

  /**
   * The password
   */
  private readonly $password: string

  /**
   * The hosturl
   */
  private $hosturl: string

  /**
   * The port
   */
  private $port: number
    

  constructor(private readonly rabbitConfig: RabbitConfig) {
    if(this.rabbitConfig.user){
      this.$username = this.rabbitConfig.user
    }
    if(this.rabbitConfig.password){
      this.$password = this.rabbitConfig.password
    }
    
    this.$credentials = this.handleCredentials(
      this.rabbitConfig.user,
      this.rabbitConfig.password
    )
    this.$hostname = this.handleHostname(
      this.rabbitConfig.hostname,
      this.rabbitConfig.port
    )
  }

  /**
   * Returns the credentials
   *
   * @param user The username
   * @param password The password
   */
  private handleCredentials(
    user: RabbitConfig['user'],
    password: RabbitConfig['password']
  ) {
    if (!user) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ user')
    }

    if (!password) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ password')
    }

    return `${user}:${password}@`
  }

  /**
   * Returns the hostname
   *
   * @param hostname The hostname
   * @param port The port
   */
  private handleHostname(
    hostname: RabbitConfig['hostname'],
    port?: RabbitConfig['port']
  ) {
    if (!hostname) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ hostname')
    }

    this.$hosturl = hostname
    if(port){
      this.$port = port
    }

    return port ? `${hostname}:${port}` : hostname
  }

  /**
   * Returns the connection URL
   */
  public get url() {
    return `amqp://${this.$credentials}${this.$hostname}`
  }

  /**
   * Returns the connection
   */
  public async getConnection() {
    if (!this.$connection) {
      try {
        const options: Options.Connect = {
          protocol: 'amqps',
          hostname: this.$hosturl,
          username: this.$username,
          password: this.$password,
          port: this.$port,
          frameMax: 40000,
        }
        // this.$connection = await connect(this.url)
        this.$connection = await connect(options)
      } catch (error) {
        throw error
      }
    }

    return this.$connection
  }

  /**
   * Closes the connection
   */
  public async closeConnection() {
    if (this.hasConnection) {
      await this.$connection.close()
      this.hasConnection = false
    }
  }
}
