// src/neo4j/neo4j.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private driver: Driver;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get<string>('NEO4J_URI') || 'bolt://localhost:7687';
    const user = this.configService.get<string>('NEO4J_USER') || 'neo4j';
    const password = this.configService.get<string>('NEO4J_PASSWORD') || 'agro_neo4j_2024';

    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    // Verificar conexión
    try {
      await this.driver.verifyConnectivity();
      console.log('✅ Neo4j conectado exitosamente');
    } catch (error) {
      console.error('❌ Error conectando a Neo4j:', error);
    }
  }

  async onModuleDestroy() {
    await this.driver.close();
  }

  getSession(): Session {
    return this.driver.session();
  }

  // =========================================
  // CRUD DE NODOS
  // =========================================

  async createNode(label: string, properties: Record<string, any>) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `CREATE (n:${label} $props) SET n.id = randomUUID() RETURN n`,
        { props: properties },
      );
      return result.records[0]?.get('n').properties;
    } finally {
      await session.close();
    }
  }

  async getAllNodes() {
    const session = this.getSession();
    try {
      const result = await session.run('MATCH (n) RETURN n, labels(n) as labels');
      return result.records.map((record) => ({
        ...record.get('n').properties,
        labels: record.get('labels'),
      }));
    } finally {
      await session.close();
    }
  }

  async getNodeById(id: string) {
    const session = this.getSession();
    try {
      const result = await session.run(
        'MATCH (n {id: $id}) RETURN n, labels(n) as labels',
        { id },
      );
      if (result.records.length === 0) return null;
      return {
        ...result.records[0].get('n').properties,
        labels: result.records[0].get('labels'),
      };
    } finally {
      await session.close();
    }
  }

  async updateNode(id: string, properties: Record<string, any>) {
    const session = this.getSession();
    try {
      const result = await session.run(
        'MATCH (n {id: $id}) SET n += $props RETURN n',
        { id, props: properties },
      );
      return result.records[0]?.get('n').properties;
    } finally {
      await session.close();
    }
  }

  async deleteNode(id: string) {
    const session = this.getSession();
    try {
      await session.run('MATCH (n {id: $id}) DETACH DELETE n', { id });
      return { deleted: true };
    } finally {
      await session.close();
    }
  }

  // =========================================
  // RELACIONES
  // =========================================

  async createRelationship(
    fromId: string,
    toId: string,
    relationshipType: string,
    properties?: Record<string, any>,
  ) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (a {id: $fromId}), (b {id: $toId})
         CREATE (a)-[r:${relationshipType} $props]->(b)
         SET r.id = randomUUID()
         RETURN r, a, b`,
        { fromId, toId, props: properties || {} },
      );
      if (result.records.length === 0) return null;
      return {
        relationship: result.records[0].get('r').properties,
        type: relationshipType,
        from: result.records[0].get('a').properties,
        to: result.records[0].get('b').properties,
      };
    } finally {
      await session.close();
    }
  }

  async getAllRelationships() {
    const session = this.getSession();
    try {
      const result = await session.run(
        'MATCH (a)-[r]->(b) RETURN r, type(r) as type, a, b',
      );
      return result.records.map((record) => ({
        ...record.get('r').properties,
        type: record.get('type'),
        from: record.get('a').properties,
        to: record.get('b').properties,
      }));
    } finally {
      await session.close();
    }
  }

  async deleteRelationship(id: string) {
    const session = this.getSession();
    try {
      await session.run('MATCH ()-[r {id: $id}]->() DELETE r', { id });
      return { deleted: true };
    } finally {
      await session.close();
    }
  }

  // =========================================
  // GRAFO COMPLETO (para visualización)
  // =========================================

  async getFullGraph() {
    const session = this.getSession();
    try {
      // Obtener nodos
      const nodesResult = await session.run(
        'MATCH (n) RETURN n, labels(n) as labels',
      );
      const nodes = nodesResult.records.map((record) => ({
        id: record.get('n').properties.id,
        label: record.get('n').properties.nombre || record.get('n').properties.name || record.get('n').properties.id,
        ...record.get('n').properties,
        group: record.get('labels')[0],
      }));

      // Obtener relaciones
      const edgesResult = await session.run(
        'MATCH (a)-[r]->(b) RETURN r, type(r) as type, a.id as fromId, b.id as toId',
      );
      const edges = edgesResult.records.map((record) => ({
        id: record.get('r').properties.id,
        from: record.get('fromId'),
        to: record.get('toId'),
        label: record.get('type'),
        ...record.get('r').properties,
      }));

      return { nodes, edges };
    } finally {
      await session.close();
    }
  }
}
