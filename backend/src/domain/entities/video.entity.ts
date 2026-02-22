export enum VideoCategory {
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
  GAMING = 'gaming',
  MUSIC = 'music',
  NEWS = 'news',
  SPORTS = 'sports',
  TECHNOLOGY = 'technology',
  TRAVEL = 'travel',
  OTHER = 'other',
}

export enum VideoStatus {
  UPLOADING = 'uploading',
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

type VideoProps = {
  id: string;
  title: string;
  description?: string;
  category: VideoCategory
  tags?: string[];
  status?: VideoStatus;
  videoFilename: string;
  videoMimeType: string;
  videoSize: number;
  videoManifestUrl?: string;
  thumbFilename: string;
  thumbMimeType: string;
  thumbSize: number;
  thumbUrl?: string;
  uploadedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export class Video {
  private readonly _id: string;
  private readonly _videoFilename: string;
  private readonly _videoMimeType: string;
  private readonly _videoSize: number;
  private readonly _videoManifestUrl?: string;
  private readonly _thumbFilename: string;
  private readonly _thumbMimeType: string;
  private readonly _createdAt: Date
  private _thumbUrl?: string;
  private _thumbSize: number;
  private _title: string;
  private _description?: string;
  private _category: VideoCategory
  private _tags: string[] = []
  private _status: VideoStatus = VideoStatus.UPLOADING;
  private _uploadedAt: Date
  private _updatedAt: Date

  private constructor(props: VideoProps) {
    this._id = props.id;
    this._title = props.title;
    this._description = props.description;
    this._category = props.category;
    this._tags = props.tags || [];
    this._videoFilename = props.videoFilename;
    this._videoMimeType = props.videoMimeType;
    this._videoSize = props.videoSize;
    this._videoManifestUrl = props.videoManifestUrl;
    this._thumbFilename = props.thumbFilename;
    this._thumbMimeType = props.thumbMimeType;
    this._thumbSize = props.thumbSize;
    this._thumbUrl = props.thumbUrl;
    this._uploadedAt = props.uploadedAt || new Date();
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._status = props.status || VideoStatus.UPLOADING;
  }

  static create(props: VideoProps): Video {
    return new Video(props);
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string | undefined {
    return this._description;
  }

  get category(): VideoCategory {
    return this._category;
  }

  get tags(): string[] {
    return this._tags;
  }

  get videoFilename(): string {
    return this._videoFilename;
  }

  get videoMimeType(): string {
    return this._videoMimeType;
  }

  get videoManifestUrl(): string | undefined {
    return this._videoManifestUrl;
  }

  get thumbFilename(): string {
    return this._thumbFilename;
  }

  get thumbMimeType(): string {
    return this._thumbMimeType;
  }

  get thumbSize(): number {
    return this._thumbSize;
  }

  get thumbUrl(): string | undefined {
    return this._thumbUrl;
  }

  get status(): VideoStatus {
    return this._status;
  }

  get videoSize(): number {
    return this._videoSize;
  }

  get uploadedAt(): Date {
    return this._uploadedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  public retitle(newTitle: string): void {
    this._title = newTitle;
    this.touch();
  }

  public redescribe(newDescription: string): void {
    this._description = newDescription;
    this.touch();
  }

  public recategorize(newCategory: VideoCategory): void {
    this._category = newCategory;
    this.touch();
  }

  public retag(newTags: string[]): void {
    this._tags = newTags;
    this.touch();
  }

  public updateStatus(newStatus: VideoStatus): void {
    this._status = newStatus;
    this.touch();
  }

  public setUploadedAt(uploadedAt: Date): void {
    this._uploadedAt = uploadedAt;
    this.touch();
  }
}