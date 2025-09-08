// Quiz Data Model
export class QuizModel {
  constructor(data = {}) {
    this._id = data._id || null;
    this.question = data.question || "";
    this.type = data.type || "mood";
    this.options = data.options || [];
    this.allowCustomAnswer = data.allowCustomAnswer || false;
    this.order = data.order || 0;
    this.isActive = data.isActive || true;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Validation methods
  isValid() {
    return this.question.trim() !== "" && this.options.length > 0;
  }

  // Transform methods
  toAPI() {
    return {
      question: this.question,
      type: this.type,
      options: this.options,
      allowCustomAnswer: this.allowCustomAnswer,
      order: this.order,
      isActive: this.isActive,
    };
  }

  static fromAPI(data) {
    return new QuizModel(data);
  }

  // Clone method
  clone() {
    return new QuizModel({
      ...this,
      options: [...this.options],
    });
  }
}

// Quiz Option Model
export class QuizOptionModel {
  constructor(data = {}) {
    this.text = data.text || "";
    this.value = data.value || "";
    this.imageUrl = data.imageUrl || null;
  }

  isValid() {
    return this.text.trim() !== "" && this.value.trim() !== "";
  }

  toAPI() {
    return {
      text: this.text,
      value: this.value,
      imageUrl: this.imageUrl,
    };
  }

  static fromAPI(data) {
    return new QuizOptionModel(data);
  }
}
